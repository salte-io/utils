import { LitElement, html, css, customElement } from 'lit-element';

import { Commands } from '@utils/src/commands';
import { PageMixin } from '@utils/src/mixins/utils-pages.js';

import '@utils/src/utils-terminal.js';
import '@utils/src/utils-button.js';

@customElement('utils-page-home')
class Home extends PageMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        margin: auto;
        padding: 20px;
      }

      h1, h2, h3 {
        margin: 0 auto;
        text-align: center;
      }

      h1 {
        font-size: 3em;
        font-weight: normal;
      }

      h2 {
        margin: 20px;
        font-family: 'Roboto Slab', serif;
        font-weight: lighter;
      }

      h3 {
        margin: 20px;
        font-family: 'Roboto Mono', monospace;
        font-weight: lighter;
        text-align: center;
      }

      utils-terminal {
        align-self: center;
      }

      .buttons {
        display: flex;
        flex-direction: column;
      }

      utils-button {
        margin: 10px;
        text-align: center;
      }

      .documentation {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        row-gap: 10px;
        column-gap: 10px;
      }
    `;
  }

  render() {
    return html`
      <h1>utils.gg</h1>
      <h2>Local only implementation of your favorite tools.</h2>
      <utils-terminal
        id="terminal" menu>
      </utils-terminal>
      <div class="documentation">
        <div class="utils">
          <h3>Quick Help</h3>
          <div class="buttons">
            ${this.utils.map((util) => html`
              <utils-button @click="${() => {
                this.terminal.add(`${util} --help`);
                this.terminal.focus();
              }}">${util}</utils-button>
            `)}
          </div>
        </div>
        <div class="examples">
          <h3>Examples</h3>
          <div class="buttons">
            ${this.examples.map((example) => html`
              <utils-button @click="${() => {
                this.terminal.add('clear');
                this.terminal.add(example.script);
                this.terminal.focus();
              }}">${example.name}</utils-button>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      value: String,
      utils: Array
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('search') && this.search.cmd) {
      const cmds = JSON.parse(atob(this.search.cmd));

      cmds.forEach((cmd) => {
        this.terminal.add(cmd);
      });
    }
  }

  constructor() {
    super();

    this.value = null;
    this.utils = Commands.commands.map((command) => command.name);

    this.examples = [{
      name: 'Encode a value as a MD5 Hash',
      script: 'echo -n "my-password" | md5'
    }, {
      name: 'Base64 Encode',
      script: 'echo -n "<user>:<password>" | base64'
    }, {
      name: 'Base64 Decode',
      script: 'echo -n "PHVzZXI+OjxwYXNzd29yZD4K" | base64 --decode'
    }, {
      name: 'SHASUM (256) Encode',
      script: 'echo -n "test" | shasum -a 256'
    }];
  }

  get terminal() {
    if (!this._terminal) {
      this._terminal = this.shadowRoot.getElementById('terminal');
    }

    return this._terminal;
  }
}

export { Home };
