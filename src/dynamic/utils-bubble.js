import { LitElement, html, css, customElement } from 'lit-element';

@customElement('utils-bubble')
class Bubble extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-flex;
        flex-direction: column;
        align-items: start;
        opacity: 0;

        transition: 0.15s ease-in-out;
        transition-property: opacity;
      }

      .content {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
      }

      :host([visible]) {
        opacity: 1;
      }
    `;
  }

  render() {
    return html`
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      duration: Number,

      visible: {
        type: Boolean,
        reflect: true
      }
    };
  }

  constructor() {
    super();

    this.remove = this.remove.bind(this);
  }

  firstUpdated() {
    setTimeout(window.requestAnimationFrame(() => {
      this.visible = true;
    }));

    this.timer = setTimeout(this.remove, this.duration || 2000);
  }

  remove() {
    if (this.removePromise) return this.removePromise;

    clearTimeout(this.timer);

    this.removePromise = this.animate([{
      height: `${this.scrollHeight}px`,
      opacity: 1
    }, {
      height: `0px`,
      opacity: 0
    }], {
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).finished.then(() => {
      this.dispatchEvent(new CustomEvent('removed'));
    });

    return this.removePromise;
  }
}

export { Bubble };
