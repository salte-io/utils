import parser from 'yargs-parser';
import outdent from 'outdent';
import { Parser } from '@utils/src/commands/utils/parser.js';

import commandModules from '@utils/src/commands/sh/*.js';

const commands = Object.keys(commandModules).map((name) => ({
  name,
  aliases: [name].concat(commandModules.aliases || []),
  cli: commandModules[name].default
}));

export class Commands {
  static async process(raw) {
    const commands = Parser.parse(raw);

    let output;
    for (const command of commands) {
      output = await this.invoke(command.name, command.args, output);
    }

    return output;
  }

  static async invoke(name, rawArgs, input) {
    const cli = await this.command(name);

    const args = parser(rawArgs, Object.assign({
      alias: {
        help: ['h']
      },
      booleans: ['help'],
      coerce: {
        _: function(arg) {
          return arg.map((arg) => arg.replace(/^"/, '').replace(/"$/, ''));
        }
      }
    }, cli.args));

    if (args.help) {
      if (!cli.help) {
        return Promise.reject(`Help not supported for. (${name})`);
      }

      let largestKey = 0;

      const cliOptions = cli.help.options || [];
      cliOptions.unshift({
        keys: ['h', 'help'],
        description: 'display this message'
      });

      const options = cliOptions.map((option) => {
        const keys = option.keys.map((key) => `${key.length === 1 ? '-' : '--'}${key}`).join(', ');
        largestKey = Math.max(largestKey, keys.length);

        return {
          keys,
          description: option.description
        };
      });

      return outdent`
        Usage: ${cli.help.usage}

        write arguments to the standard output

        ${options.length ? outdent`
          Options:

            ${options.map((option) => outdent`
              ${option.keys}${' '.repeat(largestKey - option.keys.length + 2)}${option.description}
            `).join('\n  ')}
        ` : ''}
      `
    }

    return cli.process(args, input);
  }

  static async command(name) {
    const command = this.commands.find((command) => {
      return command.aliases.includes(name);
    });

    if (command) return command.cli;

    return Promise.reject(`Unknown command. (${name})`);
  }

  static get commands() {
    return commands;
  }
}
