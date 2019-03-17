import { LitElement, html, css, customElement } from 'lit-element';

import hljs from 'highlight.js/lib/highlight';
import shell from 'highlight.js/lib/languages/shell';
hljs.registerLanguage('shell', shell);

@customElement('utils-terminal-input')
class TerminalInput extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex: 1;
        position: relative;
        min-height: 26px;
      }

      textarea {
        color: transparent;
        caret-color: white;
        background: transparent;
        margin: 2px 10px;
        padding: 0;
        resize: none;
        border: none;
        width: 100%;
        outline: none;
        font-family: inherit;
        font-size: inherit;
      }

      #visual {
        position: absolute;
        top: -1px;
        left: 10px;
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
        .value="${`$ ${(this.value || '').replace(/\$\s?/g, '')}`}"
        @input="${({ target }) => {
          const value = target.value.replace(/\$\s?/g, '');
          this.value = value;
          const event = new CustomEvent('change', {
            detail: this.value
          });
          this.dispatchEvent(event);
        }}">
      </textarea>
      <div id="visual"></div>
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
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('keydown', this.onKeyDown);
    this.addEventListener('click', this.onCursorChange);
    this.addEventListener('focus', this.onCursorChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('keydown', this.onKeyDown);
    this.removeEventListener('click', this.onCursorChange);
    this.removeEventListener('focus', this.onCursorChange);
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.visual.innerHTML = `$ ${hljs.highlight('shell', this.value || '').value}`;
    }
  }

  get visual() {
    if (!this._visual) {
      this._visual = this.shadowRoot.getElementById('visual');
    }

    return this._visual;
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
    if (e.code === 'ArrowUp') {
      e.preventDefault();
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
    } else if (e.code === 'Enter') {
      e.preventDefault();
      const event = new CustomEvent('submit', {
        detail: this.value
      });
      this.dispatchEvent(event);
      this.value = null;
    }

    this.onCursorChange(e);
  }

  onCursorChange({ target }) {
    target.selectionStart = Math.max(3, target.selectionStart);
  }
}

export default TerminalInput;
