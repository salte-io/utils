import { LitElement, html, css, customElement } from 'lit-element';

import { CopyMixin } from '@utils/src/mixins/utils-copy.js';

import { Bubbles } from '@utils/src/dynamic/utils-bubbles.js';

import { History } from '@utils/src/storage/history.js';
import { Preferences } from '@utils/src/storage/preferences.js';

import '@utils/src/utils-resizer.js';
import '@utils/src/utils-terminal-input.js';
import '@utils/src/utils-command.js';
import '@utils/src/utils-icon.js';

@customElement('utils-terminal')
class Terminal extends CopyMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        max-width: 100%;
        min-width: 600px;
        min-height: 320px;
      }

      #window {
        position: absolute;
        z-index: 9999;
        left: 0;
        right: 0;
        bottom: 0;

        display: flex;
        flex-direction: column;
        margin: 0 auto;
        border-radius: 6px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
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

      .no-menu {
        border-top-right-radius: inherit;
        border-top-left-radius: inherit;
      }

      .command {
        margin: 0 10px;
      }

      .share {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 30px;
        height: 30px;
        cursor: pointer;

        color: rgba(255, 255, 255, 0.3);
        transition: 0.15s ease-in-out;
        transition-property: color;
      }

      .share:hover {
        color: rgba(255, 255, 255, 0.8);
      }

      utils-resizer {
        min-width: inherit;
        min-height: inherit;
      }

      @media all and (max-width: 700px) {
        :host {
          min-width: 100%;
        }
      }
    `;
  }

  render() {
    return html`
      <utils-resizer
        width="${this.terminal.width}"
        height="${this.terminal.height}"
        .disabled="${this.fullscreen}"
        @resized="${({ detail: terminal }) => {
          this.terminal = terminal;
        }}">
        <div id="window">
          ${this.menu ? html`
            <div class="fake-menu">
              <div class="close"></div>
              <div class="minimize"></div>
              <div class="zoom" @click="${this.toggleFullScreen}"></div>
            </div>
          ` : ''}

          <div id="terminal" class="${this.menu ? '' : 'no-menu'}">
            ${this.commands.map((command) => html`
              <utils-command .value="${command}"
                @processed="${() => this.focus()}">
              </utils-command>
            `)}
            <utils-terminal-input
              id="input"
              .value="${this.value}"
              @submit="${({ detail }) => this.add(detail.value, detail.ignore)}">
            </utils-terminal-input>
          </div>
          <utils-icon class="share" icon="share" @click="${this.copy}"></utils-icon>
        </div>
      </utils-resizer>
    `;
  }

  static get properties() {
    return {
      terminal: Object,

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

    this.terminal = Preferences.terminal;
  }

  firstUpdated() {
    this.updateComplete.then(() => {
      this.resize();
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('terminal')) {
      Preferences.terminal = this.terminal;
    }
  }

  resize() {
    if (this.fullscreen) {
      this.window.style.top = `0`;
      this.window.style.left = `0`;
      this.window.style.right = `0`;
      this.window.style.bottom = `0`;
    } else {
      this.window.style.top = '0';
    }
  }

  add(command, ignore) {
    if (!command || !command.trim()) {
      this.commands.push('');
      this.requestUpdate();
    } else if (['clear'].includes(command.trim())) {
      this.commands = [];

      if (!ignore) History.add(command.trim());
    } else {
      this.commands.push(command);
      this.requestUpdate();

      if (!ignore) History.add(command.trim());
    }
  }

  get window() {
    if (!this._window) {
      this._window = this.shadowRoot.getElementById('window');
    }

    return this._window;
  }

  get terminalElement() {
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
    this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
  }

  copy() {
    const url = new URL(location.origin);

    url.searchParams.append('cmd', btoa(JSON.stringify(this.commands)));

    return super.copy(url.toString()).then(() => {
      Bubbles.Instance.add({
        message: 'Copied a sharable url for the commands on-screen!'
      });
    });
  }

  toggleFullScreen() {
    this.fullscreen = !this.fullscreen;

    if (this.fullscreen) {
      this.window.style.position = 'fixed';
    }

    const { top, left, right, bottom } = this.getBoundingClientRect();
    this.window.animate([{
      top: `${top}px`,
      left: `${left}px`,
      bottom: `${window.innerHeight - bottom}px`,
      right: `${window.innerWidth - right}px`,
      borderRadius: '6px'
    }, {
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      borderRadius: '0'
    }], {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      direction: this.fullscreen ? 'normal' : 'reverse'
    }).finished.then(() => {
      if (this.fullscreen) {
        this.window.style.borderRadius = '0';
      } else {
        this.window.style.borderRadius = '';
        this.window.style.position = '';
      }
      this.resize();
    });
  }
}

export { Terminal };
