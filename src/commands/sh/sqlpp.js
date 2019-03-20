import formatter from 'sql-formatter';

export default class CLI {
  static get help() {
    return {
      description: 'Pretty prints the sql provided by stdin.',
      options: [{
        keys: ['l', 'language'],
        description: 'The dialect of the sql being processed. (sql [default], n1ql, db2, pl/sql)'
      }, {
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
        number: ['n'],
        language: ['l']
      },
      default: {
        indent: 'spaces',
        number: 2,
        language: 'sql'
      },
      string: ['language', 'indent'],
      number: ['number']
    }
  }

  static process(args, input) {
    return formatter.format(input, {
      language: args.language,
      indent: (args.indent === 'spaces' ? ' ' : '\t').repeat(args.number)
    });
  }
}
