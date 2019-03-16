import { until } from 'lit-html/directives/until.js';
import { guard } from 'lit-html/directives/guard.js';
import { LitElement, html, css, customElement } from 'lit-element';

import { Commands } from './commands';

@customElement('utils-command')
class Command extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        margin: 0 10px;
      }

      .output {
        white-space: pre-wrap;
      }

      :host([error]) .output {
        color: #e84118;
      }
    `;
  }

  render() {
    return html`
      <div>$ ${this.value}</div>
      ${guard([this.value], () => until(this.output(this.value), html`Processing...`))}
    `;
  }

  static get properties() {
    return {
      error: {
        type: Boolean,
        reflect: true
      },

      value: String
    };
  }

  async output(value) {
    if (!value) return value;

    this.error = false;

    return await Commands.process(value).then((output) => {
      return html`
        <div class="output">${output.trim()}</div>
      `
    }).catch((error) => {
      this.error = true;
      return html`
        Error: ${error}
      `;
    });
  }
}

export { Command };
