import * as clipboard from 'clipboard-polyfill';

export function CopyMixin(superClass) {
  return class extends superClass {
    copy(value) {
      return clipboard.writeText(value);
    }
  }
}
