import { LitElement, html, css, customElement } from 'lit-element';
import '@salte-io/salte-pages';

import page from 'page';

import { version } from '@utils/package.json';

import './utils-footer.js';

@customElement('utils-app')
class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      salte-pages {
        flex: 1;
      }

      a {
        color: inherit;
        outline: none;
      }
    `;
  }

  render() {
    return html`
      <salte-pages selected="${this.page}" fallback="404" @load="${this.load}">
        <utils-page-home page="home"></utils-page-home>
        <utils-page-404 page="404"></utils-page-404>
      </salte-pages>

      <utils-footer>
        <div>
          Made with ❤️ by the <a href="https://github.com/salte-io" tabindex="-1">Salte Team</a>.
        </div>
      </utils-footer>
    `;
  }

  static get properties() {
    return {
      version: {
        type: String,
        reflect: true
      },

      page: {
        type: String,
        reflect: true
      },

      pages: Object
    }
  }

  constructor() {
    super();

    this.version = version;
  }

  connectedCallback() {
    super.connectedCallback();
    document.body.removeAttribute('unresolved');
    page('*', (context) => {
      const [_dummy, page] = context.path.match(/^\/([^/?]+)?/);

      if (['github', 'gitlab', 'bitbucket'].includes(page)) {
        this.page = 'repository';
      } else {
        this.page = page || 'home';
      }
    });
    page();
  }

  load({ detail: page }) {
    let promise = null;
    switch (page) {
      case 'home':
        promise = import('@utils/src/pages/utils-page-home.js');
        break;
      case '404':
        promise = import('@utils/src/pages/utils-page-404.js');
        break;
    }

    promise.then(() => {
      console.log('Loaded the page successfully!')
    }).catch((error) => {
      console.error(error);
    });
  }
}

export default App;
