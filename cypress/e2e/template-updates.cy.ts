/* eslint-disable @typescript-eslint/no-explicit-any */

describe('Template subscription updates', () => {
  let callbacks: Record<string, (message: { result: string }) => void>;
  let unsubscribes: Record<string, Sinon.SinonSpy>;
  let initialResults: Record<string, string>;
  let autoReply: boolean;
  let deferSubscription: boolean;
  let resolveSubscription: (() => void) | undefined;

  beforeEach(() => {
    callbacks = {};
    unsubscribes = {};
    initialResults = {};
    autoReply = true;
    deferSubscription = false;
    resolveSubscription = undefined;
    cy.visitHarness((win: any) => {
      cy.stub(win.hourlyWeather.hass.connection, 'subscribeMessage').callsFake((callback, message) => {
        callbacks[message.template] = callback;
        unsubscribes[message.template] = cy.spy();
        const unsubscribe = unsubscribes[message.template];
        if (autoReply) callback({ result: initialResults[message.template] ?? 'Initial title' });
        if (deferSubscription) {
          return new win.Promise(resolve => { resolveSubscription = () => resolve(unsubscribe); });
        }
        return win.Promise.resolve(unsubscribe);
      });
    });
  });

  it('updates the title after subsequent template messages', () => {
    cy.configure({ name: '{{ title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.then(() => callbacks['{{ title }}']({ result: 'Updated title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Updated title');
    cy.then(() => callbacks['{{ title }}']({ result: 'Latest title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Latest title');
  });

  it('unsubscribes when the card is removed', () => {
    cy.configure({ name: '{{ title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.window().then((win: any) => win.hourlyWeather.remove());
    cy.then(() => cy.wrap(unsubscribes['{{ title }}']).should('have.been.calledOnce'));
  });

  it('replaces subscriptions on config changes and ignores stale messages', () => {
    cy.configure({ name: '{{ old_title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.then(() => { initialResults['{{ new_title }}'] = 'New title'; });
    cy.configure({ name: '{{ new_title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'New title');
    cy.then(() => cy.wrap(unsubscribes['{{ old_title }}']).should('have.been.calledOnce'));
    cy.then(() => callbacks['{{ old_title }}']({ result: 'Stale title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'New title');
    cy.then(() => callbacks['{{ new_title }}']({ result: 'Current title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Current title');
  });

  it('releases templates when switching to a literal title', () => {
    cy.configure({ name: '{{ title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.configure({ name: 'Literal title' });
    cy.then(() => cy.wrap(unsubscribes['{{ title }}']).should('have.been.calledOnce'));
    cy.then(() => callbacks['{{ title }}']({ result: 'Stale title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Literal title');
  });

  it('resubscribes after reconnecting and ignores the detached subscription', () => {
    let oldCallback: (message: { result: string }) => void;
    let oldUnsubscribe: Sinon.SinonSpy;
    cy.configure({ name: '{{ title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.window().then((win: any) => {
      oldCallback = callbacks['{{ title }}'];
      oldUnsubscribe = unsubscribes['{{ title }}'];
      win.hourlyWeather.remove();
      initialResults['{{ title }}'] = 'Reconnected title';
      win.document.getElementById('wrapper').append(win.hourlyWeather);
    });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Reconnected title');
    cy.then(() => cy.wrap(oldUnsubscribe).should('have.been.calledOnce'));
    cy.then(() => oldCallback({ result: 'Stale title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Reconnected title');
    cy.then(() => callbacks['{{ title }}']({ result: 'Updated after reconnect' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Updated after reconnect');
  });

  it('cleans up a subscription that finishes after the card is removed', () => {
    cy.then(() => { deferSubscription = true; });
    cy.configure({ name: '{{ title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.window().then((win: any) => win.hourlyWeather.remove());
    cy.then(() => resolveSubscription?.());
    cy.then(() => cy.wrap(unsubscribes['{{ title }}']).should('have.been.calledOnce'));
  });

  it('ignores the first template response after its config is replaced', () => {
    cy.then(() => { autoReply = false; });
    cy.configure({ name: '{{ title }}' });
    cy.configure({ name: 'Replacement title' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Replacement title');
    cy.then(() => callbacks['{{ title }}']({ result: 'Late initial title' }));
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Replacement title');
  });

  it('updates numeric templates without losing the other rendered fields', () => {
    cy.then(() => {
      initialResults = { '{{ segments }}': '4', '{{ offset }}': '0', '{{ spacing }}': '2' };
    });
    cy.configure({ name: '{{ title }}', num_segments: '{{ segments }}', offset: '{{ offset }}', label_spacing: '{{ spacing }}' });
    cy.get('weather-bar').shadow().find('div.axes > div.bar-block').should('have.length', 4);
    cy.get('weather-bar').shadow().find('div.hour:not(:empty)').should('have.length', 2);
    cy.then(() => {
      callbacks['{{ segments }}']({ result: '2' });
      callbacks['{{ offset }}']({ result: '2' });
      callbacks['{{ spacing }}']({ result: '1' });
      callbacks['{{ title }}']({ result: 'Updated forecast' });
    });
    cy.get('weather-bar').shadow().find('div.axes > div.bar-block').should('have.length', 2);
    cy.get('weather-bar').shadow().find('div.hour:not(:empty)').should('have.length', 2);
    cy.get('weather-bar').shadow().find('div.temperature').first().should('have.text', '85°');
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Updated forecast');
  });

  it('keeps the latest result while another template is still pending', () => {
    cy.then(() => { autoReply = false; });
    cy.configure({ name: '{{ title }}', num_segments: '{{ segments }}' });
    cy.then(() => callbacks['{{ segments }}']({ result: '3' }));
    cy.wrap(callbacks).should('have.property', '{{ title }}');
    cy.then(() => {
      callbacks['{{ segments }}']({ result: '4' });
      callbacks['{{ title }}']({ result: 'Latest title' });
    });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Latest title');
    cy.get('weather-bar').shadow().find('div.axes > div.bar-block').should('have.length', 4);
  });

  it('renders a template update batched with unrelated hass changes', () => {
    let subscriptionCount: number;
    cy.configure({ name: '{{ title }}' });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Initial title');
    cy.window().then((win: any) => {
      subscriptionCount = win.hourlyWeather.hass.connection.subscribeMessage.callCount;
      win.hourlyWeather.hass = { ...win.hourlyWeather.hass };
      callbacks['{{ title }}']({ result: 'Updated title' });
    });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Updated title');
    cy.window().then((win: any) => expect(win.hourlyWeather.hass.connection.subscribeMessage.callCount).to.equal(subscriptionCount));
  });

  it('does not subscribe for literal configuration', () => {
    cy.configure({ name: 'Literal title', num_segments: 3 });
    cy.get('ha-card').shadow().find('h1').should('have.text', 'Literal title');
    cy.window().then((win: any) => expect(win.hourlyWeather.hass.connection.subscribeMessage).not.to.have.been.called);
  });
});
