import MD5 from 'crypto-js/md5';

export default class CLI {
  static get help() {
    return {
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
