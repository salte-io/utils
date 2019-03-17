import dedent from 'dedent';
import BaseCLI from './base.js';

export default class CLI extends BaseCLI {
  static process(rawArgs, input) {
    const args = this.parse(rawArgs, {
      alias: {
        decode: ['D']
      },
      boolean: ['decode']
    });

    if (args.help) {
      return dedent`
        Usage: base64 [-hD]

        Encode and decode using Base64 representation

        Options:
          -h, --help     display this message
          -D, --decode   decodes input
      `;
    }

    if (args.decode) {
      return atob(input);
    }

    return btoa(input);
  }
}
