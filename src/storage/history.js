import { Storage } from '@utils/src/storage/storage.js';
import { Bubbles } from '@utils/src/dynamic/utils-bubbles.js';

export class History {
  static add(command) {
    this.list.unshift(command);
    this.store(this.list);
  }

  static next() {
    if ([undefined, null].includes(this.index)) {
      this.index = 0;
    } else if (this.index >= this.list.length - 1) {
      this.index = this.list.length - 1;
      Bubbles.Instance.add({
        message: `We've hit the edge of the universe, nothing to see here...`
      });
    } else {
      this.index = this.index + 1;
    }

    return this.list[this.index];
  }

  static previous() {
    if (this.index <= -1 || [undefined, null].includes(this.index)) {
      this.index = -1;
      Bubbles.Instance.add({
        message: `We'll you've got to start somewhere!`
      });
    } else {
      this.index = this.index - 1;
    }

    return this.list[this.index];
  }

  static reset() {
    this.index = null;
  }

  static clear() {
    this._list = [];
    this.store(this._list);
  }

  static store(history) {
    Storage.set('history', JSON.stringify(history));
  }

  static get list() {
    if (!this._list) {
      this._list = JSON.parse(Storage.get('history') || '[]');
      this.store(this._list);
    }

    return this._list;
  }
}
