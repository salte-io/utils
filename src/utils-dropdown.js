import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-dropdown')
class Dropdown extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        line-height: 1;
      }

      #trigger {
        display: flex;
      }

      #options {
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 1;
        top: 100%;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 5px;
        max-height: calc(46px * 4);
        min-width: 100%;
        overflow: auto;

        pointer-events: none;
        opacity: 0;
        transition: 0.15s ease-in-out;
        transition-property: opacity;
      }

      :host([opened]) #options {
        pointer-events: all;
        opacity: 1;
      }

      #options ::slotted(*) {
        padding: 15px 20px;
        cursor: pointer;

        transition: 0.15s ease-in-out;
        transition-property: background-color;
      }

      #options ::slotted(*:hover) {
        background: rgba(255, 255, 255, 0.2);
      }

      #options ::slotted(a) {
        text-decoration: none;
      }
    `;
  }

  render() {
    return html`
      <div id="trigger" @click="${this.toggle}">
        <slot name="trigger"></slot>
      </div>
      <div id="options" @click="${this.onSelect}">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true
      }
    }
  }

  constructor() {
    super();

    this._close = this._close.bind(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('opened')) {
      if (this.opened) {
        this.updateComplete.then(() => {
          document.addEventListener('click', this._close);
        });
      } else {
        document.removeEventListener('click', this._close);
      }
    }
  }

  toggle() {
    this.opened = !this.opened;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  _close(e) {
    const path = e.path || (e.composedPath && e.composedPath());

    if (path.includes(this.trigger) || path.includes(this.options)) return;

    this.close();
  }

  get trigger() {
    if (!this._trigger) {
      this._trigger = this.shadowRoot.getElementById('trigger');
    }

    return this._trigger;
  }

  get options() {
    if (!this._options) {
      this._options = this.shadowRoot.getElementById('options');
    }

    return this._options;
  }

  onSelect(e) {
    this.dispatchEvent(new CustomEvent('select', { detail: e.target }));

    this.close();
  }
}

export { Dropdown };
