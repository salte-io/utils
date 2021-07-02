import { chalk } from '../utils/chalk';

export default class CLI {
  static get info() {
    return {
      usage: '[pattern]',
      description: 'file pattern searcher'
    };
  }

  static get pipes() {
    return false; // TODO: Add support for providing input to CLIs via pipes
  }

  static process({ args, input }) {
    if (args._.length) {
      return input.split('\n').filter((line) => {
        return line.includes(args._.join(' '));
      }).map((line) => {
        return line.replace(args._.join(' '), (substring) => {
          return `${chalk.redBright(substring)}${chalk.reset()}`;
        });
      }).join('\n');
    }

    return input;
  }
}
