import SHA1 from 'crypto-js/sha1';
import SHA224 from 'crypto-js/sha224';
import SHA256 from 'crypto-js/sha256';
import SHA384 from 'crypto-js/sha384';
import SHA512 from 'crypto-js/sha512';

export default class CLI {
  static get info() {
    return {
      usage: '[OPTION]...',
      description: 'Print SHA checksums.',
      args: [{
        name: 'algorithm',
        type: 'string',
        aliases: ['a'],
        options: ['1', '224', '256', '384', '512'],
        default: '1',
        description: '1 (default), 224, 256, 384, 512'
      }]
    };
  }

  static get pipes() {
    return true;
  }

  static async process({ args, input }) {
    switch (args.algorithm) {
      case '224': return SHA224(input).toString();
      case '256': return await SHA256(input).toString();
      case '384': return await SHA384(input).toString();
      case '512': return await SHA512(input).toString();
      case '512224': throw Error('TODO (512224)');
      case '512256': throw Error('TODO (512256)');
      default: return await SHA1(input).toString();
    }
  }
}
