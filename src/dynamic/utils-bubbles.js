import { repeat } from 'lit-html/directives/repeat';

import { LitElement, html, css, customElement } from 'lit-element';

import '@utils/src/dynamic/utils-bubble.js';

@customElement('utils-bubbles')
class Bubbles extends LitElement {
  static get styles() {
    return css`
      :host {
        position: fixed;
        z-index: 10000;
        top: 20px;
        left: 20px;

        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    const bubbles = this.bubbles.sort((a, b) => {
      if (a.duration === b.duration) return 0;
      else if (a.duration === 'sticky') return -1;
      else if (b.duration === 'sticky') return 1;

      return 0;
    });

    return html`
      ${repeat(bubbles, (bubble) => bubble.id, (bubble) => html`
        <utils-bubble
          id="bubble-${bubble.id}"
          .duration="${bubble.duration}"
          .handler="${bubble.handler}"
          @removed="${() => this.remove(bubble)}">
          ${bubble.message}
        </utils-bubble>
      `)}
    `;
  }

  static get properties() {
    return {
      bubbles: Array,
      maxBubbles: Number
    };
  }

  constructor() {
    super();

    if (Bubbles.Instance) {
      throw new Error(`An instance of 'utils-bubbles' already exists!`);
    }

    Bubbles.Instance = this;

    this.bubbles = [];
    this.maxBubbles = 4;
  }

  add(options) {
    this.id = this.id + 1 || 0;
    options.id = this.id;
    this.bubbles.push(options);

    let excessBubbles = this.bubbles.length - this.maxBubbles;

    for (let i = 0; i < excessBubbles; i++) {
      const bubble = this.bubbles[i];

      const element = this.shadowRoot.getElementById(`bubble-${bubble.id}`);
      if (bubble.duration === 0) {
        excessBubbles++;
      } else {
        element.remove();
      }
    }

    this.requestUpdate();
  }

  remove(bubble) {
    const index = this.bubbles.indexOf(bubble);

    if (index === -1) return;

    this.bubbles.splice(index, 1);
    this.requestUpdate();
  }
}

window.utils = window.utils || {};
window.utils.Bubbles = Bubbles;
export { Bubbles };
