import * as clipboard from 'clipboard-polyfill';

export default class CLI {
  static get info() {
    return {
      name: 'clipcopy',
      description: 'copies the contents of stdout to your clipboard.'
    };
  }

  static get pipes() {
    return false;
  }

  static async process(args, input) {
    return clipboard.writeText(input);
  }
}
