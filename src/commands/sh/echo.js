export default class CLI {
  static get info() {
    return {
      usage: '[SHORT-OPTION]... [STRING]...',
      description: 'write arguments to the standard output',
      args: [{
        name: 'n',
        type: 'boolean',
        description: 'Do not print the trailing newline character.'
      }]
    };
  }

  static get pipes() {
    return false;
  }

  static process({ args }) {
    return `${args._.join(' ')}${args.n ? '' : '\n'}`;
  }
}
