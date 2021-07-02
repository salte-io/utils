import { Storage } from '../storage/storage.js';

export class Preferences {
  static get terminal() {
    return JSON.parse(this.get('terminal') || '{}');
  }

  static set terminal(value) {
    this.set('terminal', JSON.stringify(value));
  }

  static get(key) {
    return Storage.get(this.key(key));
  }

  static set(key, value) {
    Storage.set(this.key(key), value);
  }

  static key(key) {
    return `pref.${key}`;
  }
}
