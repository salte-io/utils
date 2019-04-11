import formatter from 'sql-formatter';

export default class CLI {
  static get info() {
    return {
      name: 'sqlpp',
      description: 'Pretty prints the sql provided by stdin.',
      args: [{
        name: 'language',
        type: 'string',
        aliases: ['l'],
        default: 'sql',
        options: ['sql', 'n1ql', 'db2', 'pl/sql'],
        description: 'The dialect of the sql being processed.'
      }, {
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
        description: 'The number of tabs / spaces to indent by.'
      }]
    };
  }

  static get pipes() {
    return true;
  }

  static process({ args, input }) {
    return formatter.format(input, {
      language: args.language,
      indent: (args.indent === 'spaces' ? ' ' : '\t').repeat(args.number)
    });
  }
}
