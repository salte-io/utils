export default class CLI {
  static get info() {
    return {
      description: 'Pretty prints the json provided by stdin.',
      args: [{
        name: 'indent',
        type: 'string',
        aliases: ['i'],
        default: 'spaces',
        options: ['spaces', 'tabs'],
        description: `How indentation should be handled.`
      }, {
        name: 'number',
        type: 'number',
        aliases: ['n'],
        default: 2,
        description: `The number of tabs / spaces to indent by.`
      }]
    };
  }

  static get pipes() {
    return true;
  }

  static process(args, input) {
    try {
      return JSON.stringify(JSON.parse(input), {
        tabs: '\t',
        spaces: ' '
      }[args.indent], args.number);
    } catch (error) {
      throw new Error('Invalid JSON');
    }
  }
}
