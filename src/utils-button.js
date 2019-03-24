import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-button')
class Button extends LitElement {
  static get styles() {
    return css`
      :host {
        padding: 15px 20px;
        border-radius: 5px;
        cursor: pointer;

        color: var(--utils-button-color);
        background: var(--utils-button-background-color);
        border: 1px solid var(--utils-button-border-color);

        transition: 0.15s ease-in-out;
        transition-property: background-color, color;
      }

      :host(:hover),
      :host([checked]) {
        background: var(--utils-button-active-background-color);
        color: var(--utils-button-active-color);
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
      },

      theme: {
        type: String,
        reflect: true
      }
    };
  }

  constructor() {
    super();

    this.themes = {
      light: {
        '--utils-button-background-color': 'transparent',
        '--utils-button-color': '#fafafa',
        '--utils-button-border-color': '#fafafa',
        '--utils-button-active-background-color': '#fafafa',
        '--utils-button-active-color': '#1B1D23'
      },

      dark: {
        '--utils-button-background-color': '#2f3640',
        '--utils-button-color': '#fafafa',
        '--utils-button-border-color': 'transparent',
        '--utils-button-active-background-color': '#49505A',
        '--utils-button-active-color': '#fafafa'
      },

      delete: {
        '--utils-button-background-color': 'transparent',
        '--utils-button-color': '#FF5B32',
        '--utils-button-border-color': '#FF5B32',
        '--utils-button-active-background-color': '#FF5B32',
        '--utils-button-active-color': '#fafafa'
      }
    };

    this.theme = 'light';
  }

  updated(changedProperties) {
    if (changedProperties.has('checkable')) {
      if (this.checkable) {
        this.addEventListener('click', this.onCheck);
      } else {
        this.removeEventListener('click', this.onCheck);
      }
    }

    if (changedProperties.has('theme')) {
      const theme = this.themes[this.theme] || this.themes['light'];

      Object.keys(theme).forEach((key) => {
        this.style.setProperty(key, theme[key]);
      });
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
