export default class CLI {
  static get info() {
    return {
      name: 'base64',
      usage: '[-D]',
      description: 'Encode and decode using Base64 representation',
      args: [{
        name: 'decode',
        type: 'boolean',
        aliases: ['D'],
        description: 'decodes input'
      }]
    };
  }

  static get pipes() {
    return true;
  }

  static process({ args, input }) {
    if (args.decode) {
      return atob(input);
    }

    return btoa(input);
  }
}
