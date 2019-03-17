import * as clipboard from "clipboard-polyfill"

import { LitElement, html, css, customElement } from 'lit-element';

import { Commands } from './commands';

@customElement('utils-command')
class Command extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 0 10px;
        word-break: break-all;
      }

      .output {
        white-space: pre-wrap;
      }

      :host([error]) .output {
        color: #e84118;
      }

      .copy:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.1);
      }
    `;
  }

  render() {
    return html`
      <div class="copy" @click="${() => this.copy(this.value)}">$ ${this.value}</div>
      <div class="output copy" @click="${() => this.copy(this.output)}">${this.output}</div>
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

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.output = 'Processing...';
      this.process(this.value).then((output) => {
        this.output = output;
        this.requestUpdate();

        this.dispatchEvent(new CustomEvent('processed'));
      });
    }
  }

  async process(value) {
    if (!value) return value;

    this.error = false;

    return await Commands.process(value).then((output) => {
      return output.trim();
    }).catch((error) => {
      this.error = true;
      return `Error: ${error}`;
    });
  }

  copy(value) {
    // TODO: Notification Bubbles
    clipboard.writeText(value);
  }
}

export { Command };
