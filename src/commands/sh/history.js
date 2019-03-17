import { History } from '@utils/src/storage/history.js';

export default class CLI {
  static get help() {
    return {
      description: 'outputs the current history'
    }
  }

  static process() {
    const list = History.list.slice(1).reverse();
    const digits = list.length.toString().length + 2;
    return list.map((command, i) => {
      const number = i + 1;

      return `${number}${' '.repeat(digits - number.toString().length)}${command}`;
    }).join('\n');
  }
}
