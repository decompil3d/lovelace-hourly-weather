/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js'
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

import type {
  ColorConfig,
  ColorMap,
  ColorSettings,
  ConditionSpan,
  ForecastSegment,
  HourlyWeatherCardConfig,
  RenderTemplateResult,
  SegmentTemperature
} from './types';
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

  @state() private renderedConfig!: Promise<HourlyWeatherCardConfig>;

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: HourlyWeatherCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (!config.entity) {
      throw new Error(localize('errors.missing_entity'));
    }

    if (config.label_spacing) {
      const numLabelSpacing = parseInt(config.label_spacing, 10);
      if (!Number.isNaN(numLabelSpacing) && (numLabelSpacing < 2 || numLabelSpacing % 2 !== 0)) {
        throw new Error(localize('errors.label_spacing_positive_even_int'));
      }
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: localize('common.title'),
      ...config,
    };

    this.triggerConfigRender();
  }

  private triggerConfigRender(): void {
    this.renderedConfig = this.renderConfig();
  }

  private async renderConfig(): Promise<HourlyWeatherCardConfig> {
    const { config } = this;
    if (!config) return config;
    const r: HourlyWeatherCardConfig = {
      ...config,
      num_segments: await this.renderTemplate(config?.num_segments),
      offset: await this.renderTemplate(config?.offset),
      label_spacing: await this.renderTemplate(config?.label_spacing)
    };

    return r;
  }

  private async renderTemplate(raw: string | undefined): Promise<string | undefined> {
    if (!raw) return raw; // not defined
    if (typeof raw !== 'string') return raw; // not a template
    if (!raw.includes('{{')) return raw; // not a template
    return new Promise(resolve => {
      this.hass.connection.subscribeMessage<RenderTemplateResult>(
        msg => resolve(msg.result),
        {
          type: 'render_template',
          template: raw
        }
      );
    });
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
    // Block rendering until templates are rendered
    return html`${until(this.renderCore(), html``)}`;
  }

  private async renderCore(): Promise<TemplateResult | void> {
    const config = await this.renderedConfig;
    const entityId: string = config.entity;
    const state = this.hass.states[entityId];
    const { forecast } = state.attributes as { forecast: ForecastSegment[] };
    const numSegments = parseInt(config.num_segments ?? config.num_hours ?? '12', 10);
    const offset = parseInt(config.offset ?? '0', 10);
    const labelSpacing = parseInt(config.label_spacing ?? '2', 10);

    if (numSegments < 2) {
      // REMARK: Ok, so I'm re-using a localized string here. Probably not the best, but it avoids repeating for no good reason
      return await this._showError(localize('errors.label_spacing_positive_even_int').replace('label_spacing', 'num_segments'));
    }

    if (offset < 0) {
      return await this._showError(localize('errors.offset_must_be_positive_int'));
    }

    if (numSegments > (forecast.length - offset)) {
      return await this._showError(localize('errors.too_many_segments_requested'));
    }

    if (labelSpacing < 2 || labelSpacing % 2 !== 0) {
      return await this._showError(localize('errors.label_spacing_positive_even_int'));
    }

    const isForecastDaily = this.isForecastDaily(forecast);
    const conditionList = this.getConditionListFromForecast(forecast, numSegments, offset);
    const temperatures = this.getTemperatures(forecast, numSegments, offset);

    const colorSettings = this.getColorSettings(config.colors);

    return html`
      <ha-card
        .header=${config.name}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
      hasHold: hasAction(config.hold_action),
      hasDoubleClick: hasAction(config.double_tap_action),
    })}
        tabindex="0"
        .label=${`Hourly Weather: ${config.entity || 'No Entity Defined'}`}
      >
        <div class="card-content">
          ${isForecastDaily ?
        this._showWarning(localize('errors.daily_forecasts')) : ''}
          ${colorSettings.warnings.length ?
        this._showWarning(localize('errors.invalid_colors') + colorSettings.warnings.join(', ')) : ''}
          <weather-bar
            .conditions=${conditionList}
            .temperatures=${temperatures}
            .icons=${!!config.icons}
            .colors=${colorSettings.validColors}
            .hide_hours=${!!config.hide_hours}
            .hide_temperatures=${!!config.hide_temperatures}
            .label_spacing=${labelSpacing}></weather-bar>
        </div>
      </ha-card>
    `;
  }

  private getConditionListFromForecast(forecast: ForecastSegment[], numSegments: number, offset: number): ConditionSpan[] {
    let lastCond: string = forecast[offset].condition;
    let j = 0;
    const res: ConditionSpan[] = [[lastCond, 1]];
    for (let i = offset + 1; i < numSegments + offset; i++) {
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

  private getTemperatures(forecast: ForecastSegment[], numSegments: number, offset: number): SegmentTemperature[] {
    const temperatures: SegmentTemperature[] = [];
    for (let i = offset; i < numSegments + offset; i++) {
      const fs = forecast[i];
      temperatures.push({
        hour: this.formatHour(new Date(fs.datetime), this.hass.locale),
        temperature: formatNumber(fs.temperature, this.hass.locale)
      })
    }
    return temperatures;
  }

  private isForecastDaily(forecast: ForecastSegment[]): boolean {
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

  private async _showError(error: string): Promise<TemplateResult> {
    // Without this next line, we get an error accessing `setConfig` on `errorCard`, likely due to a race condition in
    // Home Assistant's lovelace logic. This line just triggers a stack unroll before we continue rendering. That deals
    // with the race condition effectively, it seems.
    await new Promise(resolve => setTimeout(resolve, 0));
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
