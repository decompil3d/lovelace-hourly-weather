const haCardTemplate = document.createElement('template');
haCardTemplate.innerHTML = `
<style>
  h1 {
    font-family: sans-serif;
    font-size: 24px;
    letter-spacing: -0.012em;
    line-height: 48px;
    padding: 12px 16px 16px;
    margin-block: 0px;
    font-weight: normal;
  }
  ::slotted(.card-content) {
    padding: 0 16px 16px;
    margin-top: -8px;
  }
</style>
<div class='card'>
<h1 class='card-header'></h1>
<slot></slot>
</div>`;

class HACard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.append(haCardTemplate.content.cloneNode(true));
  }

  set header(value) {
    const h1 = this.shadowRoot?.querySelector('h1');
    if (!h1) throw new Error('Missing h1 from ha-card mock');
    h1.innerHTML = value;
  }
}

window.customElements.define('ha-card', HACard);
