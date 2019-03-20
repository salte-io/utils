export class Storage {
  static set(key, value) {
    if ([undefined, null].includes(value)) {
      localStorage.removeItem(this.key(key));
    } else {
      localStorage.setItem(this.key(key), value);
    }
  }

  static get(key) {
    return localStorage.getItem(this.key(key));
  }

  static key(key) {
    return `salte-io.utils.${key}`;
  }
}
