import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-input')
class Input extends LitElement {
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

      .input-container {
        position: relative;
        overflow: hidden;
        border-radius: 5px;
      }

      .input-container:before {
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

      .input-container:hover:before {
        opacity: 0.1;
      }

      input {
        border: none;
        padding: 15px 20px;
        box-sizing: border-box;
        outline: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;

        background: #2f3640;
      }

      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    `;
  }

  render() {
    return html`
      <label>${this.label}</label>
      <div class="input-container">
        <input type="${this.type}"
          .value="${this.value}"
          @change="${this.bubble}"
          @input="${this.bubble}">
      </div>
    `;
  }

  static get properties() {
    return {
      label: {
        type: String,
        reflect: true
      },
      type: String,
      value: String
    }
  }

  constructor() {
    super();

    this.type = 'text';
  }

  bubble(e) {
    e.stopPropagation();

    this.dispatchEvent(new CustomEvent(e.type, {
      detail: e.target.value
    }));
  }
}

export { Input };
