import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-options')
class Option extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        line-height: 1;
      }

      :host(:not([label])) label {
        display: none;
      }

      label {
        padding: 15px 20px;
        font-weight: lighter;
      }

      #selection {
        position: relative;
        padding: 15px 20px;
        border-radius: 5px;

        background: #2f3640;
        transition: 0.15s ease-in-out;
        transition-property: background-color;
        cursor: pointer;
      }

      #selection:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background: white;

        opacity: 0;
        transition: 0.15s ease-in-out;
        transition-property: opacity;
      }

      #selection:hover:before {
        opacity: 0.1;
      }

      #options {
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

      #options ::slotted(.selected) {
        font-style: italic;
      }

      #options ::slotted(*:hover) {
        background: rgba(255, 255, 255, 0.2);
      }
    `;
  }

  render() {
    return html`
      <label>${this.label}</label>
      <div id="selection" @click="${this.toggle}">${this.selected || this.placeholder}</div>
      <div id="options" @click="${this.select}">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      label: {
        type: String,
        reflect: true
      },

      selected: String,

      placeholder: String,

      attrForSelected: {
        type: String,
        reflect: true,
        attribute: 'attr-for-selected'
      },

      opened: {
        type: Boolean,
        reflect: true
      }
    }
  }

  constructor() {
    super();

    this._close = this._close.bind(this);
    this.attrForSelected = 'value';
    this.placeholder = 'Select an option...';
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

    if (changedProperties.has('selected')) {
      const previousSelected = this.element(changedProperties.get('selected'));

      if (previousSelected) {
        previousSelected.classList.remove('selected');
      }

      const selected = this.element(this.selected);

      if (selected) {
        selected.classList.add('selected');
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

    if (path.includes(this.selection) || path.includes(this.options)) return;

    this.close();
  }

  select({ target }) {
    this.selected = this.value(target);

    this.dispatchEvent(new CustomEvent('change', {
      detail: this.selected
    }));

    this.close();
  }

  element(value) {
    return this.querySelector(`[${this.attrForSelected}="${value}"]`);
  }

  value(element) {
    return element.getAttribute(this.attrForSelected);
  }

  get selection() {
    if (!this._selection) {
      this._selection = this.shadowRoot.getElementById('selection');
    }

    return this._selection;
  }

  get options() {
    if (!this._options) {
      this._options = this.shadowRoot.getElementById('options');
    }

    return this._options;
  }
}

export { Option };
