import { LitElement, html, css, customElement } from 'lit-element';

import { CopyMixin } from './mixins/utils-copy.js';

import { Bubbles } from './dynamic/utils-bubbles.js';

import { History } from './storage/history.js';
import { Preferences } from './storage/preferences.js';

import './utils-resizer.js';
import './utils-terminal-window.js';
import './utils-terminal-input.js';
import './utils-command.js';
import './utils-icon.js';

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

      #window {
        position: absolute;
        z-index: 9999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
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
        <utils-terminal-window id="window" @zoom="${this.toggleFullScreen}" menu>
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
          <utils-icon slot="window" class="share" icon="share" @click="${this.copy}"></utils-icon>
        </utils-terminal-window>
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
      this.requestUpdate('commands');
    } else if (['clear'].includes(command.trim())) {
      this.commands = [];

      if (!ignore) History.add(command.trim());
    } else {
      this.commands.push(command);
      this.requestUpdate('commands');

      if (!ignore) History.add(command.trim());
    }
  }

  get window() {
    if (!this._window) {
      this._window = this.shadowRoot.getElementById('window');
    }

    return this._window;
  }

  get input() {
    if (!this._input) {
      this._input = this.shadowRoot.getElementById('input');
    }

    return this._input;
  }

  focus() {
    this.input.focus();
    this.window.scrollToBottom();
  }

  copy() {
    const url = new URL(`${location.origin}${location.pathname}`);

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
