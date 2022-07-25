const huiWarningTemplate = document.createElement('template');
huiWarningTemplate.innerHTML = `<p><slot></slot></p>`;

class HUIWarning extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.append(huiWarningTemplate.content.cloneNode(true));
  }
}

window.customElements.define('hui-warning', HUIWarning);
