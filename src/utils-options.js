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
        user-select: none;

        opacity: 0;
        transition: 0.15s ease-in-out;
        transition-property: opacity;
      }

      #selection:hover:before {
        opacity: 0.1;
      }

      utils-dropdown ::slotted(.selected) {
        font-style: italic;
      }

      utils-dropdown {
        position: initial;
      }

      .end {
        display: flex;
        align-self: end;
      }

      .end > ::slotted(*) {
        margin-right: 10px;
      }
    `;
  }

  render() {
    return html`
      <label>${this.label}</label>
      <div class="end">
        <slot name="secondary"></slot>
        <utils-dropdown @select="${this.select}">
          <utils-button slot="trigger" theme="dark">${this.selected || this.placeholder}</utils-button>
          <slot></slot>
        </utils-dropdown>
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
      }
    }
  }

  constructor() {
    super();

    this.attrForSelected = 'value';
    this.placeholder = 'Select an option...';
  }

  updated(changedProperties) {
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

  select({ detail: selectedElement }) {
    this.selected = this.value(selectedElement);

    this.dispatchEvent(new CustomEvent('change', {
      detail: this.selected
    }));
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
}

export { Option };
