import { LitElement, html, css, customElement } from 'lit-element';

import { PageMixin } from '@utils/src/mixins/utils-pages.js';
import { TypeMixin } from '@utils/src/mixins/utils-type.js';
import { RandomMixin } from '@utils/src/mixins/utils-random.js';

import '@utils/src/utils-card.js';
import '@utils/src/utils-terminal-window.js';
import '@utils/src/utils-command.js';
import pipesImage from '../../images/pipes.svg';

@customElement('utils-page-home')
class Home extends RandomMixin(TypeMixin(PageMixin(LitElement))) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 1000px;
        margin: auto;
        padding: 20px;
      }

      .tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        row-gap: 10px;
        column-gap: 10px;
      }

      .tool {
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .tool > * {
        flex: 1;
      }

      .hover {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        border-radius: 5px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        font-family: 'Roboto Slab', serif;
        font-weight: lighter;
        text-align: center;
        user-select: none;

        font-size: 40px;
        background: white;
        color: #2f3640;

        opacity: 0;
        transition: 0.15s ease-in-out;
        transition-property: opacity;
      }

      .tool:hover .hover {
        opacity: 0.25;
      }

      #output {
        white-space: pre-wrap;
      }

      .pipes {
        width: 100%;
        border-radius: 5px;
      }
    `;
  }

  get header() {
    return 'Dashboard';
  }

  render() {
    return html`
      <div class="tools">
        <a class="tool" href="/terminal">
          <utils-terminal-window menu>
            ${this.command ? html`
              <utils-command .value="${this.command}"></utils-command>
            ` : ''}
            <div>$ <span id="typeit"></span></div>
          </utils-terminal-window>
          <div class="hover">Launch<br>Terminal</div>
        </a>
        <a class="tool" href="/pipes">
          <utils-card>
            <img class="pipes" src="${pipesImage}">
          </utils-card>
          <div class="hover">Launch<br>Pipes GUI</div>
        </a>
      </div>
    `;
  }

  static get properties() {
    return {
      output: Object,
      command: String
    };
  }

  constructor() {
    super();

    this.previousCommands = [];
    this.commands = [
      'echo "my-username:my-password" | base64',
      'echo "{ "name": "value" }" | jsonpp',
      'echo "Hello World!" | md5',
      `echo "Grep saves lives!" | grep lives`
    ];
  }

  firstUpdated() {
    this.randomlyEnterCommandOnInterval();
  }

  randomlyEnterCommandOnInterval() {
    const command = this.pseudoRandomItem(this.commands, this.previousCommands);
    this.previousCommands.push(command);

    if (this.previousCommands.length === this.commands.length) {
      this.previousCommands.splice(0, 1);
    }

    this.enterCommand(command).then(() => {
      this.randomlyEnterCommandOnInterval();
    });
  }

  async enterCommand(command) {
    let instance = await this.type({
      element: this.typeit,
      text: command
    });

    instance.empty();
    this.command = command;

    await this.wait(1000);

    instance = await this.type({
      element: this.typeit,
      text: 'clear'
    });

    instance.empty();
    this.command = null;
  }

  get typeit() {
    if (!this._typeit) {
      this._typeit = this.shadowRoot.getElementById('typeit');
    }

    return this._typeit;
  }
}

export { Home };
