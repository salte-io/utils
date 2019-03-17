export default class CLI {
  static get help() {
    return {
      usage: 'echo [SHORT-OPTION]... [STRING]...',
      description: 'write arguments to the standard output',
      options: [{
        keys: ['n'],
        description: 'Do not print the trailing newline character.'
      }]
    }
  }

  static get args() {
    return {
      boolean: ['n']
    };
  }

  static process(args) {
    return `${args._.join(' ')}${args.n ? '' : '\n'}`;
  }
}
