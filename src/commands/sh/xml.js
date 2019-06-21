import { pd } from 'pretty-data';

export default class CLI {
  static get info() {
    return {
      description: 'Pretty prints the xml provided by stdin.'
    };
  }

  static get pipes() {
    return true;
  }

  static process({ input }) {
    return pd.xml(input);
  }
}
