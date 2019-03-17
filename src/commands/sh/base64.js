export default class CLI {
  static get help() {
    return {
      usage: '[-D]',
      description: 'Encode and decode using Base64 representation',
      options: [{
        keys: ['D', 'decode'],
        description: 'decodes input'
      }]
    }
  }

  static get args() {
    return {
      alias: {
        decode: ['D']
      },
      boolean: ['decode']
    };
  }

  static process(args, input) {
    if (args.decode) {
      return atob(input);
    }

    return btoa(input);
  }
}
