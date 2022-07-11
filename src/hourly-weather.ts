/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
  formatNumber,
  formatTime,
  FrontendLocaleData,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
import { isValidColorName, isValidHSL, isValidRGB } from 'is-valid-css-color';

import type { ColorConfig, ColorMap, ColorSettings, ConditionSpan, ForecastHour, HourlyWeatherCardConfig, HourTemperature } from './types';
import { actionHandler } from './action-handler-directive';
import { version } from '../package.json';
import { localize } from './localize/localize';
import { WeatherBar } from './weather-bar';
import { ICONS } from './conditions';
customElements.define('weather-bar', WeatherBar);

/* eslint no-console: 0 */
console.info(
  `%c  HOURLY-WEATHER-CARD \n%c  ${localize('common.version')} ${version}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'hourly-weather',
  name: localize('common.title_card'),
  description: localize('common.description'),
});

@customElement('hourly-weather')
export class HourlyWeatherCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('hourly-weather-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: HourlyWeatherCardConfig;

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: HourlyWeatherCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (!config.entity) {
      throw new Error(localize('errors.missing_entity'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: localize('common.title'),
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    const entityId: string = this.config.entity;
    const state = this.hass.states[entityId];
    const { forecast } = state.attributes as { forecast: ForecastHour[] };
    const numHours = this.config.num_hours ?? 12;

    if (numHours > forecast.length) {
      return this._showError(localize('errors.too_many_hours_requested'));
    }

    const isForecastDaily = this.isForecastDaily(forecast);
    const conditionList = this.getConditionListFromForecast(forecast, numHours);
    const temperatures: HourTemperature[] = forecast.map(fh => ({
      hour: this.formatHour(new Date(fh.datetime), this.hass.locale),
      temperature: formatNumber(fh.temperature, this.hass.locale)
    }));
    temperatures.length = numHours;

    const colorSettings = this.getColorSettings(this.config.colors);

    return html`
      <ha-card
        .header=${this.config.name}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
      hasHold: hasAction(this.config.hold_action),
      hasDoubleClick: hasAction(this.config.double_tap_action),
    })}
        tabindex="0"
        .label=${`Boilerplate: ${this.config.entity || 'No Entity Defined'}`}
      >
        <div class="card-content">
          ${isForecastDaily ?
        this._showWarning(localize('errors.daily_forecasts')) : ''}
          ${colorSettings.warnings.length ?
        this._showWarning(localize('errors.invalid_colors') + colorSettings.warnings.join(', ')) : ''}
          <weather-bar
            .conditions=${conditionList}
            .temperatures=${temperatures}
            .icons=${!!this.config.icons}
            .colors=${colorSettings.validColors}></weather-bar>
        </div>
      </ha-card>
    `;
  }

  private getConditionListFromForecast(forecast: ForecastHour[], numHours = 12): ConditionSpan[] {
    let lastCond: string = forecast[0].condition;
    let j = 0;
    const res: ConditionSpan[] = [[lastCond, 1]];
    for (let i = 1; i < numHours; i++) {
      const cond: string = forecast[i].condition;
      if (cond === lastCond) {
        res[j][1]++;
      } else {
        res.push([cond, 1]);
        j++;
        lastCond = cond;
      }
    }
    return res;
  }

  private isForecastDaily(forecast: ForecastHour[]): boolean {
    const dates = forecast.map(f => new Date(f.datetime).getDate());
    const uniqueDates = new Set(dates);
    return uniqueDates.size >= forecast.length - 1;
  }

  private formatHour(time: Date, locale: FrontendLocaleData): string {
    const formatted = formatTime(time, locale);
    if (formatted.includes('AM') || formatted.includes('PM')) {
      // Drop ':00' in 12 hour time
      return formatted.replace(':00', '');
    }
    return formatted;
  }

  private getColorSettings(colorConfig?: ColorConfig): ColorSettings {
    if (!colorConfig) return {
      validColors: void 0,
      warnings: []
    };

    const validColors: ColorMap = new Map();
    const warnings: string[] = [];
    Object.entries(colorConfig).forEach(([k, v]) => {
      if (this.isValidColor(k, v))
        validColors.set(k as keyof ColorConfig, v);
      else
        warnings.push(`${k}: ${v}`);
    });
    return {
      validColors,
      warnings
    };
  }

  private isValidColor(key: string, color: string): boolean {
    if (!(key in ICONS)) {
      return false;
    }
    if (!(isValidRGB(color) ||
      isValidColorName(color) ||
      isValidHSL(color))) {
      return false;
    }

    return true;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html` <hui-warning>${warning}</hui-warning> `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html` ${errorCard} `;
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return css``;
  }
}
