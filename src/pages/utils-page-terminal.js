import { LitElement, html, css, customElement } from 'lit-element';

import { PageMixin } from '../mixins/utils-pages.js';
import { TypeMixin } from '../mixins/utils-type.js';
import { RandomMixin } from '../mixins/utils-random.js';

import '../utils-terminal.js';
import '../utils-button.js';

@customElement('utils-page-terminal')
class Terminal extends RandomMixin(TypeMixin(PageMixin(LitElement))) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        margin: auto;
        padding: 20px;
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

      #tips {
        padding: 10px;
        margin: auto;
      }
    `;
  }

  get header() {
    return 'Terminal';
  }

  render() {
    return html`
      <utils-terminal
        id="terminal" menu>
      </utils-terminal>
      <div id="tips"></div>
    `;
  }

  static get properties() {
    return {
      value: String,
      utils: Array
    };
  }

  constructor() {
    super();

    this.previousTips = [];
    this.tips = [
      'Try typing "help" to see a list of available commands!',
      'View your previous commands with "history"!',
      'Tired of manually entering input with echo? Checkout "clippaste"!'
    ];
  }

  firstUpdated() {
    this.recursiveShowTip();
  }

  recursiveShowTip() {
    const tip = this.pseudoRandomItem(this.tips, this.previousTips);
    this.previousTips.push(tip);

    if (this.previousTips.length === this.tips.length) {
      this.previousTips.splice(0, 1);
    }

    this.showTip(tip).then(() => {
      this.recursiveShowTip();
    });
  }

  async showTip(tip) {
    const instance = await this.type({
      element: this.tipsElement,
      text: tip
    });

    await this.wait(2000);
    instance.empty();
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('search') && this.search.cmd) {
      const cmds = JSON.parse(atob(this.search.cmd));

      cmds.forEach((cmd) => {
        this.terminal.add(cmd);
      });
    }
  }

  get terminal() {
    if (!this._terminal) {
      this._terminal = this.shadowRoot.getElementById('terminal');
    }

    return this._terminal;
  }

  get tipsElement() {
    if (!this._tipsElement) {
      this._tipsElement = this.shadowRoot.getElementById('tips');
    }

    return this._tipsElement;
  }
}

export { Terminal };
