import 'web-animations-js/web-animations-next-lite.min.js';
import 'url-polyfill';

import page from 'page';

export function PageMixin(superClass) {
  return class extends superClass {
    static get properties() {
      return {
        search: Object
      };
    }

    connectedCallback() {
      super.connectedCallback();
      page('*', (context, next) => {
        const url = new URL(location.href);

        const search = {};
        url.searchParams.forEach((value, key) => {
          if (Array.isArray(search[key])) {
            search[key].push(value);
          } else if (search[key]) {
            search[key] = [search[key], value];
          } else {
            search[key] = value;
          }
        });
        this.search = search;
        next();
      });
      page();
    }

    show(animate) {
      if (animate) {
        return this.animate([
          { opacity: 0 },
          { opacity: 1 }
        ], {
          duration: 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).finished;
      }
    }

    hide() {
      return this.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }).finished.then((animation) => {
        animation.cancel();
      });
    }
  }
}
