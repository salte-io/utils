import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { LitElement, html, css, customElement } from 'lit-element';

import Convert from 'ansi-to-html';

import { CopyMixin } from '@utils/src/mixins/utils-copy.js';
import { Commands } from '@utils/src/commands';

import { Bubbles } from '@utils/src/dynamic/utils-bubbles.js';

@customElement('utils-command')
class Command extends CopyMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        word-break: break-all;
      }

      .command {
        padding-left: 20px;
        line-height: 1.5;
      }

      .command:before {
        content: '$';
        position: absolute;
        left: 0;
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
      <div class="command ${this.terminal ? '' : 'copy'}" @click="${() => this.copy(this.value)}">${this.value}</div>
      ${this.output ? html`
        <div class="output copy" @click="${() => this.copy(this.output)}">${unsafeHTML(this.output)}</div>
      ` : ''}
    `;
  }

  static get properties() {
    return {
      error: {
        type: Boolean,
        reflect: true
      },

      value: String,

      terminal: {
        type: Boolean,
        reflect: true
      }
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('value') && !this.terminal) {
      this.process(this.value).then((output) => {
        const convert = new Convert();
        this.output = convert.toHtml(output || '');
        this.requestUpdate();

        setTimeout(window.requestAnimationFrame(() => {
          this.dispatchEvent(new CustomEvent('processed'));
        }));
      });
    }
  }

  async process(value) {
    if (!value) return value;

    this.error = false;

    return await Commands.process(value).catch((error) => {
      console.error(error);
      this.error = true;
      return `Error: ${error}`;
    });
  }

  copy(value) {
    return super.copy(value).then(() => {
      Bubbles.Instance.add({
        message: 'Copied successfully!'
      });
    });
  }
}

export { Command };
