import dedent from 'dedent';
import MD5 from 'crypto-js/md5';

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
        Usage: md5

        Calculate a message-digest fingerprint (checksum) for a file
      `;
    }

    return MD5(input).toString();
  }
}
