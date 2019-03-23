import { LitElement, html, css, customElement } from 'lit-element';
import '@salte-io/salte-pages';

import page from 'page';

import { version } from '@utils/package.json';

import '@utils/src/dynamic/utils-bubbles.js';
import '@utils/src/utils-footer.js';
import '@utils/src/events/optimized.js';

@customElement('utils-app')
class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      h1, h2, h3 {
        margin: 0 auto;
        text-align: center;
        line-height: 1;
      }

      h1 {
        font-size: 3em;
        font-weight: normal;
        margin-top: 40px;
      }

      h2 {
        margin: 20px;
        font-family: 'Roboto Slab', serif;
        font-weight: lighter;
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
      <utils-bubbles></utils-bubbles>

      <h1>utils.gg</h1>
      <h2>Local only implementation of your favorite tools.</h2>

      <salte-pages selected="${this.page}" fallback="404" @load="${this.load}" @loaded="${this.onLoaded}">
        <utils-page-home page="home"></utils-page-home>
        <utils-page-terminal page="terminal"></utils-page-terminal>
        <utils-page-pipes page="pipes"></utils-page-pipes>
        <utils-page-404 page="404"></utils-page-404>
      </salte-pages>

      <utils-footer>
        <div>Special thanks to <a href="https://www.netlify.com">Netlify</a> for powering the website.</div>
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
    page('*', (context, next) => {
      const [_dummy, page] = context.path.match(/^\/([^/?]+)?/);

      this.page = page || 'home';

      next();
    });
    page();
  }

  load({ detail: page }) {
    let promise = null;
    switch (page) {
      case 'home':
        promise = import('@utils/src/pages/utils-page-home.js');
        break;
      case 'terminal':
        promise = import('@utils/src/pages/utils-page-terminal.js');
        break;
      case 'pipes':
        promise = import('@utils/src/pages/utils-page-pipes.js');
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

  onLoaded({ detail: page }) {
    const selectedPage = this.shadowRoot.querySelector(`[page="${page}"]`);

    document.title = `${selectedPage.header} • Utils`
  }
}

export { App };
