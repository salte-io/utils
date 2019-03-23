import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-terminal-window')
class TerminalWindow extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        border-radius: 6px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
      }

      .minimize,
      .zoom,
      .close {
        box-sizing: border-box;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        border: 1px solid #000;
        position: relative;
        top: 6px;
        display: inline-block;
        overflow: hidden;
        cursor: pointer;
      }

      .close {
        position: relative;
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
      }

      .close:before,
      .minimize:before,
      .zoom:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background: white;

        opacity: 0;
        transition: 500ms cubic-bezier(0.4, 0, 0.2, 1);
        transition-property: opacity;
      }

      .close:hover:before,
      .minimize:hover:before,
      .zoom:hover:before {
        opacity: 0.5;
      }

      .menu {
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
        font-family: monospace;
        font-size: 16px;
        overflow: auto;

        height: 0px;
        width: 100%;
        box-sizing: border-box;
      }

      #content {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
      }

      :host(:not([menu])) #terminal {
        border-top-right-radius: inherit;
        border-top-left-radius: inherit;
      }
    `;
  }

  render() {
    return html`
      ${this.menu ? html`
        <div class="menu">
          <div class="close" @click="${this.onClose}"></div>
          <div class="minimize" @click="${this.onMinimize}"></div>
          <div class="zoom" @click="${this.onZoom}"></div>
        </div>
      ` : ''}

      <div id="terminal">
        <div id="content">
          <slot></slot>
        </div>
      </div>

      <slot name="window"></slot>
    `;
  }

  static get properties() {
    return {
      menu: {
        type: Boolean,
        reflect: true
      }
    }
  }

  onClose(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('close'));
  }

  onMinimize(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('minimize'));
  }

  onZoom(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('zoom'));
  }

  scrollToBottom() {
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  get terminal() {
    if (!this._terminal) {
      this._terminal = this.shadowRoot.getElementById('terminal');
    }

    return this._terminal;
  }
}

export { TerminalWindow };
