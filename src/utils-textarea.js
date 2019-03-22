import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-textarea')
class Textarea extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
      }

      :host([readonly]):before,
      :host([disabled]):before {
        opacity: 0.1;
      }

      textarea {
        resize: none;
        border: none;
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        min-height: 320px;
        overflow: auto;
        color: inherit;
        font-family: inherit;
        font-size: inherit;

        background: #2f3640;
      }

      :host:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background: white;

        opacity: 0;
        transition: 0.15s ease-in-out;
        transition-property: opacity;
      }

      :host(:hover):before {
        opacity: 0.1;
      }
    `;
  }

  render() {
    return html`
      <textarea
        .readOnly="${this.readonly}"
        .placeholder="${this.placeholder || ''}"
        .value="${this.value || null}"
        @change="${this.bubble}"
        @input="${this.bubble}">
      </textarea>
    `;
  }

  static get properties() {
    return {
      value: String,
      placeholder: String,
      readonly: {
        type: Boolean,
        reflect: true
      }
    };
  }

  bubble(e) {
    e.stopPropagation();

    this.dispatchEvent(new CustomEvent(e.type, {
      detail: e.target.value
    }));
  }
}

export { Textarea };
