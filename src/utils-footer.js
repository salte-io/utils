import { LitElement, html, css, customElement } from 'lit-element';
import '@salte-io/salte-pages';

@customElement('utils-footer')
class Footer extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 20px;
      }

      :host > ::slotted(.end) {
        margin-left: auto;
      }
    `;
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

export { Footer };
