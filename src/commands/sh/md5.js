import MD5 from 'crypto-js/md5';
import BaseCLI from './base.js';

export default class CLI extends BaseCLI {
  static process(args, input) {
    return MD5(input);
  }
}
