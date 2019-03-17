import { Parser } from './utils/parser.js';

export class Commands {
  static async process(raw) {
    const commands = Parser.parse(raw);

    let output;
    for (const command of commands) {
      output = await this.invoke(command.name, command.args, output);
    }

    return output;
  }

  static async invoke(name, args, input) {
    const cli = await this.command(name);

    return cli.process(args, input);
  }

  static command(name) {
    let promise = null;

    switch(name) {
      case 'echo':
        promise = import('./sh/echo.js');
        break;
      case 'md5':
        promise = import('./sh/md5.js');
        break;
      case 'base64':
        promise = import('./sh/base64.js');
        break;
      default:
        promise = Promise.reject(`Unknown command. (${name})`);
    }

    return promise.then((imported) => {
      return imported.default;
    }).catch((error) => {
      throw error;
    });
  }
}
