# Contributing

## Quick Start

```sh
# Install the Packages!
$ npm install
# Start the server at http://localhost:8081
$ npm start serve
```

## Creating a `cli`

Creating a new cli is fairly straight forward.

First, create the `cli` class for your respective cli.

```js
// @utils/src/commands/sh/echo.js
export default class CLI {
  static get help() {
    // This outputs something similar to the following when the user enters 'echo --help'
    // 
    // Usage: echo [SHORT-OPTION]... [STRING]...
    //
    // write arguments to the standard output
    //
    // Options
    //
    //   -n  Do not print the trailing newline character.
    return {
      // Don't mention the cli name, this enables us to 
      // dynamically specify the name if there are aliases!
      usage: '[SHORT-OPTION]... [STRING]...',
      description: 'write arguments to the standard output',
      options: [{
        keys: ['n'],
        description: 'Do not print the trailing newline character.'
      }]
    }
  }

  // We utilize 'yargs-parser' for parsing arguments.
  // As such these align with their options.
  // https://www.npmjs.com/package/yargs-parser#requireyargs-parserargs-opts
  static get args() {
    return {
      boolean: ['n']
    };
  }

  // This needs to return the string output of your cli
  static process(args) {
    return `${args._.join(' ')}${args.n ? '' : '\n'}`;
  }
}
```
