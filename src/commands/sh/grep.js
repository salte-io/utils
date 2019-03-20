import { chalk } from '@utils/src/commands/utils/chalk.js'

export default class CLI {
  static get help() {
    return {
      usage: '[pattern]',
      description: 'file pattern searcher'
    };
  }

  static process(args, input) {
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
