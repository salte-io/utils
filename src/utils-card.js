import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-card')
class Card extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        background: #1B1D23;
        border-radius: 5px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
        padding: 20px;
      }
    `;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

export { Card };
