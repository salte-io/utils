import MD5 from 'crypto-js/md5';

import BaseCLI from './base.js';

export default class CLI extends BaseCLI {
  static get help() {
    return {
      usage: 'md5',
      description: 'Calculate a message-digest fingerprint (checksum) for a file'
    };
  }

  static get args() {
    return {
      alias: {
        decode: ['D']
      },
      boolean: ['decode']
    };
  }

  static process(args, input) {
    return MD5(input).toString();
  }
}
