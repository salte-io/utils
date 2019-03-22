import * as clipboard from 'clipboard-polyfill';

export default class CLI {
  static get info() {
    return {
      description: 'pastes the contents of your clipboard to stdin.'
    };
  }

  static get pipes() {
    return false;
  }

  static async process() {
    return clipboard.readText();
  }
}
