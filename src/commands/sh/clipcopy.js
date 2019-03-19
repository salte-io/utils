import * as clipboard from 'clipboard-polyfill';

export default class CLI {
  static get help() {
    return {
      description: 'copies the contents of stdout to your clipboard.'
    };
  }

  static async process(args, input) {
    return clipboard.writeText(input);
  }
}
