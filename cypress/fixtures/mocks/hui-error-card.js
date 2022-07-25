class HUIErrorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const text = document.createElement('p');
    text.textContent = 'Error';
    this.shadowRoot?.append(text);
  }

  setConfig({ error }) {
    const text = this.shadowRoot?.querySelector('p');
    if (!text) throw new Error('Mising error text node');
    text.textContent = error;
  }
}

window.customElements.define('hui-error-card', HUIErrorCard);
