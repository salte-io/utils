import { LitElement, html, css, customElement } from 'lit-element';

import './events/optimized.js';

@customElement('utils-resizer')
class Resizer extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        height: 100%;
        max-width: 100%;
      }

      .resizer {
        position: absolute;
        z-index: 10000;

        transition: 0.15s ease-in-out;
        transition-property: background-color;
      }

      :host([disabled]) .resizer {
        pointer-events: none;
      }

      .resizer:hover {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 2.5px;
      }

      .resizer.corner {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        z-index: 10001;
      }

      .resizer.se {
        bottom: 0;
        right: 0;
        transform: translate(2.5px, 2.5px);
        cursor: nwse-resize;
      }

      .resizer.s {
        bottom: 0;
        left: 0;
        right: 0;
        height: 5px;
        cursor: ns-resize;
      }

      .resizer.e {
        top: 0;
        bottom: 0;
        right: 0;
        width: 5px;
        cursor: ew-resize;
      }
    `;
  }

  render() {
    return html`
      <div class="se resizer corner" @mousedown="${this.beginResize}"></div>
      <div class="s resizer" @mousedown="${this.beginResize}"></div>
      <div class="e resizer" @mousedown="${this.beginResize}"></div>
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      width: Number,
      height: Number,

      disabled: {
        type: Boolean,
        reflect: true
      }
    }
  }

  constructor() {
    super();

    this.resize = this.resize.bind(this);
    this.stopResize = this.stopResize.bind(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('width')) {
      this.style.width = `${this.width}px`;
    }

    if (changedProperties.has('height')) {
      this.style.height = `${this.height}px`;
    }

    if (changedProperties.has('disabled')) {
      this.stopResize();
    }
  }

  beginResize(e) {
    e.preventDefault();
    this.resizer = e.target;

    window.addEventListener('mousemove', this.resize, {
      passive: true
    });
    window.addEventListener('mouseup', this.stopResize);
  }

  resize(e) {
    if (this.any(this.resizer, 'e', 'se')) {
      this.width = e.clientX - this.getBoundingClientRect().left;
    }

    if (this.any(this.resizer, 's', 'se')) {
      this.height = e.clientY - this.getBoundingClientRect().top;
    }
  }

  any(element, ...classes) {
    for (const clazz of classes) {
      if (element.classList.contains(clazz)) return true;
    }

    return false;
  }

  stopResize() {
    this.resizer = null;
    window.removeEventListener('mousemove', this.resize);

    this.dispatchEvent(new CustomEvent('resized', {
      detail: {
        width: this.width,
        height: this.height
      }
    }))
  }
}

export { Resizer };
