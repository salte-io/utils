import 'web-animations-js/web-animations-next-lite.min.js';
import { LitElement, html, css, customElement } from 'lit-element';

import './utils-terminal-input.js';
import './utils-command.js';

@customElement('utils-terminal')
class Terminal extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      #window {
        position: fixed;
        z-index: 9999;
        left: 20px;
        right: 20px;

        display: flex;
        flex-direction: column;
        margin: 0 auto;
        max-width: 600px;
        height: 320px;
        border-radius: 6px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);

        transition: 500ms cubic-bezier(0.4, 0, 0.2, 1);
        transition-property: top, left, right, bottom, max-width, height, border-radius;
      }

      .minimize,
      .zoom,
      .close {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        border: 1px solid #000;
        position: relative;
        top: 6px;
        display: inline-block;
      }

      .close {
        left: 6px;
        background-color: #ff5c5c;
        border-color: #e33e41;
      }

      .minimize {
        left: 11px;
        background-color: #ffbd4c;
        border-color: #e09e3e;
      }

      .zoom {
        left: 16px;
        background-color: #00ca56;
        border-color: #14ae46;
        cursor: pointer;

        transition: 500ms cubic-bezier(0.4, 0, 0.2, 1);
        transition-property: background-color;
      }

      .zoom:hover {
        background-color: #aae3c6;
      }

      .fake-menu {
        display: flex;
        box-sizing: border-box;
        height: 25px;
        border-top-right-radius: inherit;
        border-top-left-radius: inherit;
        background-color: #ebebeb;
        background: -webkit-linear-gradient(top, #ebebeb, #d5d5d5);
        background: -moz-linear-gradient(top, #ebebeb, #d5d5d5);
        background: -ms-linear-gradient(top, #ebebeb, #d5d5d5);
        background: -o-linear-gradient(top, #ebebeb, #d5d5d5);
        background: linear-gradient(top, #ebebeb, #d5d5d5);
      }

      #terminal {
        display: flex;
        flex-direction: column;
        flex: 1;
        position: relative;
        background: #1B1D23;
        color: white;
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: inherit;
        padding: 15px;
        font-family: monospace;
        font-size: 16px;
        overflow: auto;
      }

      :host([fullscreen]) #window {
        max-width: 100%;
        top: 0 !important;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        border-radius: 0;
      }

      .no-menu {
        border-top-right-radius: inherit;
        border-top-left-radius: inherit;
      }

      .command {
        margin: 0 10px;
      }
    `;
  }

  render() {
    return html`
      <div id="window">
        ${this.menu ? html`
          <div class="fake-menu">
            <div class="close"></div>
            <div class="minimize"></div>
            <div class="zoom" @click="${() => this.fullscreen = !this.fullscreen}"></div>
          </div>
        ` : ''}

        <div id="terminal" class="${this.menu ? '' : 'no-menu'}">
          ${this.commands.map((command) => html`
            <utils-command .value="${command}" @processed="${() => {
              this.terminal.scrollTo(0, this.terminal.scrollHeight);
            }}"></utils-command>
          `)}
          <utils-terminal-input
            id="input"
            .value="${this.value}"
            @submit="${({ detail: value }) => this.add(value)}">
          </utils-terminal-input>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      menu: {
        type: Boolean,
        reflect: true
      },

      fullscreen: {
        type: Boolean,
        reflect: true
      },

      commands: Array
    }
  }

  constructor() {
    super();

    this.resize = this.resize.bind(this);

    this.commands = [];

    window.addEventListener('optimizedResize', this.resize, { passive: true });
  }

  firstUpdated() {
    this.updateComplete.then(() => {
      this.resize();
    });
  }

  resize() {
    this.style.height = `${this.window.clientHeight}px`;
    this.style.width = `${this.window.clientWidth}px`;
    this.window.style.top = `${this.offsetTop}px`;
  }

  add(command) {
    if (!command || !command.trim()) {
      this.commands.push('');
      this.requestUpdate();
    } else if (['clear'].includes(command.trim())) {
      this.commands = [];
    } else {
      this.commands.push(command);
      this.requestUpdate();
    }
  }

  get window() {
    if (!this._window) {
      this._window = this.shadowRoot.getElementById('window');
    }

    return this._window;
  }

  get terminal() {
    if (!this._terminal) {
      this._terminal = this.shadowRoot.getElementById('terminal');
    }

    return this._terminal;
  }

  get input() {
    if (!this._input) {
      this._input = this.shadowRoot.getElementById('input');
    }

    return this._input;
  }

  focus() {
    this.input.focus();
  }
}

export default Terminal;
