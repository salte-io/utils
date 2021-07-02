import { repeat } from 'lit-html/directives/repeat';
import { LitElement, html, css, customElement } from 'lit-element';

import { Commands } from './commands';

import './utils-card.js';
import './utils-options.js';
import './utils-input.js';
import './utils-checkbox.js';
import './utils-button.js';
import './utils-icon.js';

@customElement('utils-pipe')
class Pipe extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      utils-card {
        display: grid;
        grid-row-gap: 20px;
      }

      .divider {
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      h3 {
        font-weight: lighter;
        margin: 0;
        padding: 15px 20px;
      }

      .output {
        font-size: 16px;
        font-family: monospace;
      }
    `;
  }

  render() {
    return html`
      <utils-card>
        <utils-options
          label="Command"
          .selected="${this.commandName}"
          placeholder="Select a Pipe!"
          @change="${this.onCommandChange}">
          ${this.commandName ? html`
            <utils-button
              slot="secondary"
              theme="delete"
              @click="${this.onDelete}">
              <utils-icon icon="delete"></utils-icon>
            </utils-button>
          ` : ''}
          ${this.commands.map((command) => html`
            <div value="${command.name}">${command.name} - ${command.cli.info.description}</div>
          `)}
        </utils-options>

        ${this.args && this.args.length ? html`
          <div class="divider"></div>

          ${repeat(this.args, (arg) => html`
            ${this.argToHtml(arg)}
          `)}
        ` : ''}

        ${this.command ? html`
          <div class="divider"></div>

          <h3>Output</h3>

          <utils-textarea class="output" readonly .value="${this.output}"></utils-textarea>
        ` : ''}
      </utils-card>
    `;
  }

  static get properties() {
    return {
      input: String,
      output: String,

      commandName: String,

      commands: Array,
      args: Object,
      create: {
        type: Boolean,
        reflect: true
      }
    };
  }

  async updated(changedProperties) {
    if (changedProperties.has('command') || changedProperties.has('input') || changedProperties.has('args')) {
      if (this.command && this.input && this.args) {
        const args = this.args.reduce((output, arg) => {
          output[arg.name] = arg.value;
          return output;
        }, {});

        try {
          this.output = await this.command.cli.process({ args, input: this.input });
          this.dispatchEvent(new CustomEvent('change', {
            detail: this.output
          }));
        } catch (error) {
          this.output = error.message;
        }
      } else {
        this.output = null;
      }
    }
  }

  get commandName() {
    return this._commandName;
  }

  set commandName(commandName) {
    this._commandName = commandName;
    this.command = this.commands.find((command) => command.name === this.commandName);

    this.args = this.processArgs(this.command);
    this.requestUpdate();
  }

  constructor() {
    super();

    this.commands = Commands.commands.filter((command) => command.cli.pipes);
  }

  processArgs(command) {
    return command.cli.info.args && command.cli.info.args.map((arg) => Object.assign({
      value: arg.default
    }, arg)) || [];
  }

  argToHtml(arg) {
    if (arg.type === 'string') {
      return html`
        <utils-options
          .label="${arg.name}"
          .selected="${arg.value}"
          @change="${({ detail }) => {
            arg.value = detail;
            this.requestUpdate('args');
          }}">
          ${repeat(arg.options, (option) => html`
            <div value="${option}">${option}</div>
          `)}
        </utils-options>
      `;
    } else if (arg.type === 'number') {
      return html`
        <utils-input
          .label="${arg.name}"
          .value="${arg.value}"
          type="number"
          @change="${({ detail }) => {
            arg.value = Number(detail);
            this.requestUpdate('args');
          }}">
        </utils-input>
      `;
    } else if (arg.type === 'boolean') {
      return html`
        <utils-checkbox
          .label="${arg.name}"
          .checked="${arg.value}"
          @change="${({ detail }) => {
            arg.value = detail;
            this.requestUpdate('args');
          }}">
        </utils-checkbox>
      `;
    }

    return 'Unknown';
  }

  onCommandChange(e) {
    if (this.create) {
      this.dispatchEvent(new CustomEvent('create', {
        detail: e.detail
      }));

      e.target.selected = null;
    } else {
      this.commandName = e.detail;
    }
  }

  onDelete() {
    this.dispatchEvent(new CustomEvent('delete'));
  }
}

export { Pipe };
