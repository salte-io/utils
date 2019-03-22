import parser from 'yargs-parser';
import outdent from 'outdent';
import { Parser } from '@utils/src/commands/utils/parser.js';

import commandModules from '@utils/src/commands/sh/*.js';

const commands = Object.keys(commandModules).map((name) => ({
  name,
  aliases: [name].concat(commandModules[name].aliases || []),
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
    }, this.convertArgsToYargs(cli.info.args)));

    if (args.help) {
      let largestOptionKey = 0;

      const cliOptions = cli.info.args || [];
      cliOptions.unshift({
        name: 'help',
        aliases: ['h'],
        description: 'display this message'
      });

      const options = cliOptions.map((arg) => {
        const keys = [arg.name].concat(arg.aliases || [])
          .map((key) => `${key.length === 1 ? '-' : '--'}${key}`)
          .join(', ');

        largestOptionKey = Math.max(largestOptionKey, keys.length);

        const options = arg.options && arg.options.map((option) => `${option} ${option === arg.default ? '[default]' : ''}`.trim());

        return {
          keys,
          description: `${arg.description} ${options ? `(${options.join(', ')})` : ''}`.trim()
        };
      });

      let largestCommandKey = 0;

      const cliCommands = cli.info.commands || [];
      const commands = cliCommands.map((command) => {
        const keys = [command.name].concat(command.aliases || []).join(', ');
        largestCommandKey = Math.max(largestCommandKey, keys.length);

        return {
          keys,
          description: command.description
        };
      });

      return outdent`
        Usage: ${name} ${cli.info.usage || ''}

        ${cli.info.description}
        ${commands.length ? outdent`\n
          Commands:

            ${commands.map((command) => outdent`
              ${command.keys}${' '.repeat(largestCommandKey - command.keys.length)} - ${command.description}
            `).join('\n  ')}\n
        `: ''}
        ${options.length ? outdent`
          Options:

            ${options.map((option) => outdent`
              ${option.keys}${' '.repeat(largestOptionKey - option.keys.length + 2)}${option.description}
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

  static convertArgsToYargs(args) {
    return args && args.reduce((output, arg) => {
      output[arg.type] = output[arg.type] || [];
      output[arg.type].push(arg.name);

      if (arg.aliases) {
        output.alias = output.alias || {};
        output.alias[arg.name] = arg.aliases;
      }

      if (arg.default) {
        output.default = output.default || {};
        output.default[arg.name] = arg.default;
      }

      return output;
    }, {});
  }
}
