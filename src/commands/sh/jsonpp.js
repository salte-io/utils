export default class CLI {
  static get help() {
    return {
      description: 'Pretty prints the json provided by stdin.',
      options: [{
        keys: ['i', 'indent'],
        description: `How indentation should be handled. ('tabs' or 'spaces')`
      }, {
        keys: ['n', 'number'],
        description: 'The number of tabs / spaces to indent by.'
      }]
    }
  }

  static get args() {
    return {
      alias: {
        indent: ['i'],
        number: ['n']
      },
      default: {
        indent: 'spaces',
        number: 2
      },
      string: ['indent'],
      number: ['number']
    };
  }

  static process(args, input) {
    return JSON.stringify(JSON.parse(input), {
      tabs: '\t',
      spaces: ' '
    }[args.indent], args.number);
  }
}
