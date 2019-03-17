export class History {
  static add(command) {
    this.list.unshift(command);
    this.store(this.list);
  }

  static next() {
    if ([undefined, null].includes(this.index)) {
      this.index = 0;
    } else {
      this.index = Math.min(this.index + 1, this.list.length - 1);
    }

    return this.list[this.index];
  }

  static previous() {
    if (![undefined, null].includes(this.index)) {
      this.index = Math.max(this.index - 1, -1);
    }

    return this.list[this.index];
  }

  static reset() {
    this.index = null;
  }

  static clear() {
    this.list = [];
    this.store(this.list);
  }

  static store(history) {
    localStorage.setItem('salte-io.utils.history', JSON.stringify(history));
  }

  static get list() {
    if (!this._list) {
      this._list = JSON.parse(localStorage.getItem('salte-io.utils.history') || '[]');
      this.store(this._list);
    }

    return this._list;
  }
}
