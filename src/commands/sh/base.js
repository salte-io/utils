import parser from 'yargs-parser';

export default class BaseCLI {
  static parse(rawArgs, options) {
    return parser(rawArgs, Object.assign({
      alias: {
        help: ['h']
      },
      booleans: ['help'],
      coerce: {
        _: function(arg) {
          return arg.map((arg) => arg.replace(/^"/, '').replace(/"$/, ''));
        }
      }
    }, options));
  }
}
