import { pd } from 'pretty-data';

export default class CLI {
  static get help() {
    return {
      description: 'Pretty prints the sql provided by stdin.'
    }
  }

  static process(args, input) {
    return pd.sql(input);
  }
}
