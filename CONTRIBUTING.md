# Contributing

## Quick Start

```sh
# Install the Packages!
$ npm install
# Start the server at http://localhost:8081
$ npm start
```

## Creating a `cli`

Creating a new cli is fairly straight forward.

First, create the `cli` class for your respective cli.

```js
// @utils/src/commands/sh/echo.js
export default class CLI {
  // This is utilized for both help and parsing the arguments.
  static get info() {
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
      args: [{
        name: 'n',
        type: 'boolean', // valid values are 'string', 'number', and 'boolean'
        description: 'Do not print the trailing newline character.'
      }]
    };
  }

  // This needs to return the string output of your cli
  static process(args) {
    return `${args._.join(' ')}${args.n ? '' : '\n'}`;
  }
}
```
