import * as clipboard from 'clipboard-polyfill';

export default class CLI {
  static get info() {
    return {
      name: 'clippaste',
      description: 'pastes the contents of your clipboard to stdin.'
    };
  }

  static get unsupported() {
    if (navigator.clipboard && navigator.clipboard.readText) return false;

    return `Browser doesn't support reading the clipboard.`;
  }

  static get pipes() {
    return false;
  }

  static async process() {
    return clipboard.readText();
  }
}
