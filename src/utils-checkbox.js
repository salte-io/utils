import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-checkbox')
class Checkbox extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 1;
      }

      :host(:not([label])) label {
        display: none;
      }

      label {
        padding: 15px 20px;
        font-weight: lighter;
      }

      .checkbox {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #2f3640;
        height: 36px;
        width: 36px;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
      }

      .checked {
        border-radius: inherit;
        width: 24px;
        height: 24px;
        background: white;

        transform: scale(0);
        transition: 0.15s ease-in-out;
        transition-property: transform;
      }

      :host([checked]) .checked {
        transform: scale(1);

        opacity: 1;
      }
    `;
  }

  render() {
    return html`
      <label>${this.label}</label>
      <div class="checkbox" @click="${this.onClick}">
        <div class="checked"></div>
      </div>
    `;
  }

  static get properties() {
    return {
      label: {
        type: String,
        reflect: true
      },

      checked: {
        type: Boolean,
        reflect: true
      }
    }
  }

  constructor() {
    super();

    this.checked = false;
  }

  onClick() {
    this.checked = !this.checked;

    this.dispatchEvent(new CustomEvent('change', {
      detail: this.checked
    }));
  }
}

export { Checkbox };
