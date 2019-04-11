import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { LitElement, html, css, customElement } from 'lit-element';
import icons from './images/icons/*.svg';

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
      icons: Array,
      icon: String
    };
  }

  constructor() {
    super();

    console.log(icons);
  }
}

export { Terminal };
