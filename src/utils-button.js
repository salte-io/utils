import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-button')
class Button extends LitElement {
  static get styles() {
    return css`
      :host {
        padding: 5px 20px;
        border-radius: 3px;
        cursor: pointer;

        color: #fafafa;
        border: 1px solid #fafafa;

        transition: 0.15s ease-in-out;
        transition-property: background-color, color;
      }

      :host(:hover),
      :host([checked]) {
        background: #fafafa;
        color: #1B1D23;
      }
    `;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true
      },

      checkable: {
        type: Boolean,
        reflect: true
      }
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('checkable')) {
      if (this.checkable) {
        this.addEventListener('click', this.onCheck);
      } else {
        this.removeEventListener('click', this.onCheck);
      }
    }
  }

  onCheck() {
    this.checked = !this.checked;

    this.dispatchEvent(new CustomEvent('checked', {
      detail: this.checkable
    }));
  }
}

export { Button };
