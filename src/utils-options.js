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

      .selection {
        padding: 15px 20px;
        border-radius: 5px;

        background: rgba(0, 0, 0, 0.2);
        transition: 0.15s ease-in-out;
        transition-property: background-color;
        cursor: pointer;
      }

      .selection:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .options {
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

      :host([opened]) .options {
        pointer-events: all;
        opacity: 1;
      }

      .options ::slotted(*) {
        padding: 15px 20px;
        cursor: pointer;

        transition: 0.15s ease-in-out;
        transition-property: background-color;
      }

      .options ::slotted(.selected) {
        font-style: italic;
      }

      .options ::slotted(*:hover) {
        background: rgba(255, 255, 255, 0.2);
      }
    `;
  }

  render() {
    return html`
      <label>${this.label}</label>
      <div class="selection" @click="${this.toggle}">${this.selected || this.placeholder}</div>
      <div class="options" @click="${this.select}">
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

    if (path.includes(this)) return;

    this.close();
  }

  select({ target }) {
    const previousSelected = this.querySelector(`[${this.attrForSelected}="${this.selected}"]`);

    if (previousSelected) {
      previousSelected.classList.remove('selected');
    }

    target.classList.add('selected');

    this.selected = this.value(target);

    this.dispatchEvent(new CustomEvent('change', {
      detail: this.selected
    }));
    this.close();
  }

  value(element) {
    return element.getAttribute(this.attrForSelected);
  }
}

export { Option };
