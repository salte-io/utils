import { repeat } from 'lit-html/directives/repeat';
import { LitElement, html, css, customElement } from 'lit-element';

import { PageMixin } from '../mixins/utils-pages.js';

import '../utils-card.js';
import '../utils-textarea.js';
import '../utils-pipe.js';

@customElement('utils-page-pipes')
class Pipes extends PageMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        margin: auto;
        padding: 20px;
      }

      utils-pipe {
        margin-top: 20px;
      }

      utils-textarea {
        font-size: 16px;
        font-family: monospace;
      }

      h3 {
        font-weight: lighter;
        margin: 0;
        padding: 15px 20px;
      }
    `;
  }

  render() {
    return html`
      <utils-card>
        <h3>Input</h3>
        <utils-textarea
          .value="${this.input}"
          @input="${({ detail }) => this.input = detail}">
        </utils-textarea>
      </utils-card>

      ${repeat(this.pipes, (pipe, i) => html`
        <utils-pipe
          .commandName="${pipe}"
          .input="${i === 0 ? this.input : this.outputs[i - 1]}"
          @change="${({ detail }) => {
            this.outputs[i] = detail;
            this.requestUpdate('outputs');
          }}"
          @delete="${() => {
            this.pipes.splice(i, 1);
            this.requestUpdate('pipes');
          }}">
        </utils-pipe>
      `)}

      <utils-pipe create @create="${({ detail }) => {
        this.pipes.push(detail);
        this.requestUpdate('pipes');
      }}"></utils-pipe>
    `;
  }

  static get properties() {
    return {
      input: String,
      pipes: Array,
      outputs: Object
    };
  }

  get header() {
    return 'Pipes';
  }

  constructor() {
    super();

    this.pipes = [];
    this.outputs = {};
  }
}

export { Pipes };
