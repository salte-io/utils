import dedent from 'dedent';
import BaseCLI from './base.js';

export default class CLI extends BaseCLI {
  static process(rawArgs) {
    const args = this.parse(rawArgs, {
      boolean: ['n']
    });

    if (args.help) {
      return dedent`
        Usage: echo [SHORT-OPTION]... [STRING]...

        write arguments to the standard output

        Options:

          -n    Do not print the trailing newline character.
      `;
    }

    return `${args._.join(' ')}${args.n ? '' : '\n'}`;
  }
}
