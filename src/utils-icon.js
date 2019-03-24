import fs from 'fs';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { LitElement, html, css, customElement } from 'lit-element';

// Magically include missing dependency "Buffer"
// by merely mentioning the word. :O

const icons = {
  share: fs.readFileSync('./images/icons/share.svg', 'UTF8'),
  delete: fs.readFileSync('./images/icons/delete.svg', 'UTF8')
};

@customElement('utils-icon')
class Terminal extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      svg {
        fill: currentColor;

        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    return html`
      ${unsafeHTML(icons[this.icon])}
    `;
  }

  static get properties() {
    return {
      icon: String
    };
  }
}

export { Terminal };
