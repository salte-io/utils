import * as clipboard from 'clipboard-polyfill';

export default class CLI {
  static get help() {
    return {
      description: 'pastes the contents of your clipboard to stdin.'
    };
  }

  static async process() {
    return clipboard.readText();
  }
}
