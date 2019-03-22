import { LitElement, html, css, customElement } from 'lit-element';
import { KEY_UP, KEY_DOWN, KEY_RETURN, KEY_U, KEY_K } from 'keycode-js';

import hljs from 'highlight.js/lib/highlight';
import shell from 'highlight.js/lib/languages/shell';
hljs.registerLanguage('shell', shell);

import { History } from '@utils/src/storage/history.js';

import '@utils/src/utils-command.js';

@customElement('utils-terminal-input')
class TerminalInput extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        min-height: 26px;
        height: 100%;
      }

      textarea {
        color: transparent;
        caret-color: white;
        background: transparent;
        padding: 0;
        padding-left: 20px;
        box-sizing: border-box;
        resize: none;
        border: none;
        width: 100%;
        height: 100%;
        outline: none;
        font-family: inherit;
        font-size: inherit;
        line-height: 1.5;
      }

      utils-command {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        pointer-events: none;
      }

      /* HighlightJS Tomorrow Night */
      .hljs{display:block;overflow-x:auto;padding:.5em;background:#1E1E1E;color:#DCDCDC}.hljs-addition,.hljs-deletion{display:inline-block;width:100%}.hljs-keyword,.hljs-link,.hljs-literal,.hljs-name,.hljs-symbol{color:#569CD6}.hljs-link{text-decoration:underline}.hljs-built_in,.hljs-type{color:#4EC9B0}.hljs-class,.hljs-number{color:#B8D7A3}.hljs-meta-string,.hljs-string{color:#D69D85}.hljs-regexp,.hljs-template-tag{color:#9A5334}.hljs-formula,.hljs-function,.hljs-params,.hljs-subst,.hljs-title{color:#DCDCDC}.hljs-comment,.hljs-quote{color:#57A64A;font-style:italic}.hljs-doctag{color:#608B4E}.hljs-meta,.hljs-meta-keyword,.hljs-tag{color:#9B9B9B}.hljs-template-variable,.hljs-variable{color:#BD63C5}.hljs-attr,.hljs-attribute,.hljs-builtin-name{color:#9CDCFE}.hljs-section{color:gold}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-bullet,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-selector-pseudo,.hljs-selector-tag{color:#D7BA7D}.hljs-addition{background-color:#144212}.hljs-deletion{background-color:#600}
    `;
  }

  render() {
    return html`
      <textarea
        id="input"
        type="text"
        spellcheck="false"
        .value="${this.value || ''}"
        @input="${({ target }) => {
          this.value = target.value;
          this.dispatchEvent(new CustomEvent('change', {
            detail: this.value
          }));
        }}">
      </textarea>
      <utils-command .value="${this.value}" terminal></utils-command>
    `;
  }

  static get properties() {
    return {
      value: String
    };
  }

  constructor() {
    super();

    this.value = null;
    this.commands = [];
    this.history = History.linked;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('keydown', this.onKeyDown);
    this.addEventListener('click', this.onCursorChange);
    this.addEventListener('focus', this.onCursorChange);

    // TODO: Figure out why the terminal input gets stuck...
    // setInterval(() => {
    //   this.style.transform = this.style.transform === 'translateZ(0px)' ? '' : 'translateZ(0)';
    // }, 200);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('keydown', this.onKeyDown);
    this.removeEventListener('click', this.onCursorChange);
    this.removeEventListener('focus', this.onCursorChange);
  }

  get input() {
    if (!this._input) {
      this._input = this.shadowRoot.getElementById('input');
    }

    return this._input;
  }

  focus() {
    this.input.focus();
  }

  onKeyDown(e) {
    if (e.metaKey && e.keyCode === KEY_K) {
      e.preventDefault();

      this.submit('clear', true);
    } else if (e.ctrlKey && e.keyCode === KEY_U) {
      e.preventDefault();

      this.value = '';
    } else if (e.keyCode === KEY_UP) {
      e.preventDefault();

      this.value = History.next();
    } else if (e.keyCode === KEY_DOWN) {
      e.preventDefault();

      this.value = History.previous();
    } else if (e.keyCode === KEY_RETURN) {
      e.preventDefault();
      this.submit(this.value);
    }
  }

  submit(value, ignore) {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: {
        value,
        ignore
      }
    }));
    this.value = null;
    History.reset();
  }
}

export { TerminalInput };
