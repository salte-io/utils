import { outdent } from 'outdent';
import { chalk } from '@utils/src/commands/utils/chalk.js';

export default class CLI {
  static get info() {
    return {
      name: 'help',
      description: 'Outputs the list of commands.'
    };
  }

  static process({ commands }) {
    const supportedCommands = commands.filter((command) => !command.cli.unsupported);
    const unsupportedCommands = commands.filter((command) => command.cli.unsupported);
    const longestName = commands.map((command) => command.name.length).reduce((a, b) => Math.max(a || 0, b || 0));

    return outdent`
      ${unsupportedCommands.length > 0 ? outdent`
        Unsupported Commands:

          ${unsupportedCommands.map((command) => outdent`
            ${chalk.white(`${command.name}${' '.repeat(longestName - command.name.length)} - ${command.cli.unsupported}`)}
          `).join('\n  ')}
      ` : ''}

      Available Commands:

        ${supportedCommands.map((command) => outdent`
          ${command.cli.unsupported ? chalk.white(command.name) : command.name}${' '.repeat(longestName - command.name.length)} - ${command.cli.info.description}
        `).join('\n  ')}
    `.trim();
  }
}
