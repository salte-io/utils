import { LitElement, html, css, customElement } from 'lit-element';

import PageMixin from '@utils/src/mixins/utils-pages.js';

@customElement('utils-page-404')
class NotFound extends PageMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    return html`
      Four Oh Four
    `;
  }
}

export default NotFound;
