import { History } from '@utils/src/storage/history.js';

export default class CLI {
  static get info() {
    return {
      description: 'outputs the current history',
      commands: [{
        name: 'clear',
        description: 'Clears your history'
      }]
    };
  }

  static get pipes() {
    return false;
  }

  static process(args) {
    if (args._[0] === 'clear') {
      History.clear();
      return 'History cleared.';
    }

    const list = History.list.slice(1).reverse();
    const digits = list.length.toString().length + 2;
    return list.map((command, i) => {
      const number = i + 1;

      return `${number}${' '.repeat(digits - number.toString().length)}${command}`;
    }).join('\n');
  }
}
