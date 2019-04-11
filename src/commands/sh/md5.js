import MD5 from 'crypto-js/md5';

export default class CLI {
  static get info() {
    return {
      name: 'md5',
      description: 'Calculate a message-digest fingerprint (checksum) for a file'
    };
  }

  static get pipes() {
    return true;
  }

  static process({ input }) {
    return MD5(input).toString();
  }
}
