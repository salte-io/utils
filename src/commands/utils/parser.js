export class Parser {
  static parse(raw) {
    const pipes = raw.split('')
      .map((char, i) => { if (char === '|') return i; })
      .filter((i) => { return i >= 0; })
      .filter((i) => this.isNotInsideQuotes(raw, i));

    const rawCommands = this.pipesToRawCommands(raw, pipes);

    return this.rawCommandsToCommands(rawCommands);
  }

  static isInsideQuotes(raw, index) {
    for (let i = index; i < raw.length; i++) {
      const char = raw[i];
      const previousChar = raw[i - 1];

      // TODO: This doesn't verify that we're inside the quotes we matched.
      // e.g. echo 'te|s"t' and echo "te|s't" would match early.
      // Although I can't think of a scenario where this would matter.
      if (['"', '\''].includes(char) && previousChar !== '\\') return true;
    }

    return false;
  }

  static isNotInsideQuotes(raw, index) {
    return !this.isInsideQuotes(raw, index);
  }

  static pipesToRawCommands(raw, indicies) {
    const output = [
      raw.substring(0, indicies.length === 0 ? raw.length : indicies[0])
    ];

    return indicies.reduce((output, index, i) => {
      const nextIndex = indicies[i + 1];

      if (nextIndex) {
        output.push(raw.substring(index + 1, nextIndex).trim());
      } else {
        output.push(raw.substring(index + 1).trim());
      }

      return output;
    }, output);
  }

  static rawCommandsToCommands(rawCommands) {
    return rawCommands.map((rawCommand) => {
      const [_dummy, name] = rawCommand.match(/^([^\s]+)/);
      return {
        name,
        args: rawCommand.replace(name, '').trim()
      };
    });
  }
}
