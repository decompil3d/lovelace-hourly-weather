import { css, html, LitElement, PropertyValueMap, TemplateResult, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import tippy, { Instance } from 'tippy.js';
import { ICONS, LABELS } from "./conditions";
import { DIRECTIONS_BEARINGS } from './directions';
import { getWindBarbSVG } from "./lib/svg-wind-barbs";
import type { ColorMap, ConditionSpan, DisplayCondition, IconFillType, IconMap, SegmentPrecipitation, SegmentTemperature, SegmentWind, ShowDateType, WindType } from "./types";

const tippyStyles: string = process.env.TIPPY_CSS!;

export class WeatherBar extends LitElement {
  @property({ type: Array })
  conditions: ConditionSpan[] = [];

  @property({ type: Array })
  segment_conditions: DisplayCondition[] = [];

  @property({ type: Array })
  temperatures: SegmentTemperature[] = [];

  @property({ type: Array })
  wind: SegmentWind[] = [];

  @property({ type: Array })
  precipitation: SegmentPrecipitation[] = [];

  @property({ type: Boolean })
  icons = false;

  @property({ type: Object })
  icon_map: IconMap | undefined = void 0;

  @property({ attribute: false })
  colors: ColorMap | undefined = void 0;

  @property({ type: Boolean })
  hide_hours = false;

  @property({ type: Boolean })
  hide_temperatures = false;

  @property({ type: Boolean })
  hide_bar = false;

  @property({ type: String })
  icon_fill: IconFillType = 'single';

  @property({ type: String })
  show_wind: WindType = 'false';

  @property({ type: Boolean })
  show_precipitation_amounts = false;

  @property({ type: Boolean })
  show_precipitation_probability = false;

  @property({ type: Boolean })
  precipitation_on_bar = false;

  @property({ type: Number })
  precipitation_amount_font_size = 11;

  @property({ type: Number })
  precipitation_probability_font_size = 10;

  @property({ type: String })
  show_date: ShowDateType = 'false';

  @property({ type: Number })
  label_spacing = 2;

  @property({ type: Object })
  labels = LABELS;

  private tips: Instance[] = [];

  render() {
    const showBarOverlay = this.precipitation_on_bar && !this.hide_bar;
    const conditionBars: TemplateResult[] = [];
    let gridStart = 1;
    if (!this.hide_bar) {
      for (const cond of this.conditions) {
        const label = this.labels[cond[0]];

        const icon = this.getConditionIcon(cond[0]);

        const iconMarkup: TemplateResult[] = [];
        if (showBarOverlay) {
          // The per-segment overlay supplies the icon and precipitation data.
        } else if (!this.icons) {
          iconMarkup.push(html`<span class="condition-label">${label}</span>`);
        } else {
          let iconSize: IconFillType;
          if (!this.icon_fill || this.icon_fill === 'single') {
            iconSize = cond[1]; // grid width of segment, so one icon
          } else if (this.icon_fill === 'full') {
            iconSize = 1;
          } else {
            iconSize = Math.max(Number(this.icon_fill) || 0, 1); //`Number(this.icon_fill) || 0` will evaluate as 0 if icon_fill is null or undefined.
          }
          let iconGridStart = 1;
          for (let i = 0; i < cond[1]; i += iconSize) {
            const iconStyles: Readonly<StyleInfo> = { gridColumnStart: String(iconGridStart), gridColumnEnd: String(iconGridStart += iconSize * 2) };
            iconMarkup.push(html`<span class="condition-icon" style=${styleMap(iconStyles)}><ha-icon icon=${icon}></ha-icon></span>`)
          }
        }

        const barStyles: Readonly<StyleInfo> = { gridColumnStart: String(gridStart), gridColumnEnd: String(gridStart += cond[1] * 2) };
        conditionBars.push(html`
          <div class=${cond[0]} style=${styleMap(barStyles)} data-tippy-content=${label}>
            ${iconMarkup}
          </div>
        `);
      }
    }

    const windCfg = this.show_wind ?? '';
    const barBlocks: TemplateResult[] = [];
    let lastDate: string | null = null;
    for (let i = 0; i < this.temperatures.length; i += 1) {
      const skipLabel = i % (this.label_spacing) !== 0;
      const hideHours = this.hide_hours || skipLabel;
      const hideTemperature = this.hide_temperatures || skipLabel;
      const showWindSpeed = (windCfg === 'true' || windCfg.includes('speed')) && !skipLabel;
      const showWindDirection = (windCfg === 'true' || windCfg.includes('direction')) && !skipLabel;
      const showWindBarb = windCfg.includes('barb') && !skipLabel;
      const showPrecipitationAmounts = this.show_precipitation_amounts && !skipLabel && !showBarOverlay;
      const showPrecipitationProbability = this.show_precipitation_probability && !skipLabel && !showBarOverlay;
      const { hour, date, temperature } = this.temperatures[i];
      let renderedDate: string | TemplateResult | null = null;
      if (!skipLabel && this.show_date && this.show_date !== 'false') {
        if (this.show_date === 'all') renderedDate = date;
        else if (this.show_date === 'boundary') {
          if (lastDate !== date) {
            renderedDate = date;
            lastDate = date;
          } else {
            renderedDate = html`&nbsp;`;
          }
        }
      }
      const { windSpeed, windSpeedRawMS, windDirection, windDirectionRaw } = this.wind[i];

      const wind: TemplateResult[] = [];
      const bearing: number | undefined = typeof windDirectionRaw === 'number'
        ? windDirectionRaw
        : DIRECTIONS_BEARINGS[windDirectionRaw?.toLowerCase()];
      if (showWindBarb && bearing !== undefined) {
        wind.push(html`<span title=${`${windSpeed} ${windDirection}`}>
          ${this.getWindBarb(windSpeedRawMS, bearing)}
        </span>`);
        if (showWindSpeed || showWindDirection) wind.push(html`<br>`);
      }
      if (showWindSpeed) wind.push(html`${windSpeed}`);
      if (showWindSpeed && showWindDirection) wind.push(html`<br>`);
      if (showWindDirection) wind.push(html`${windDirection}`);

      const { precipitationAmount, precipitationProbability, precipitationProbabilityText } = this.precipitation[i];
      const precipitation: TemplateResult[] = [];
      if (showPrecipitationAmounts) precipitation.push(html`${precipitationAmount}`);
      if (showPrecipitationAmounts && showPrecipitationProbability) precipitation.push(html`<br>`);
      if (showPrecipitationProbability) precipitation.push(
        html`<span title=${precipitationProbabilityText}>${precipitationProbability}</span>`);

      barBlocks.push(html`
        <div class="bar-block">
          <div class="bar-block-left"></div>
          <div class="bar-block-right"></div>
          <div class="bar-block-bottom">
            <div class="date">${renderedDate}</div>
            <div class="hour">${hideHours ? null : hour}</div>
            <div class="temperature">${hideTemperature ? null : html`${temperature}&deg;`}</div>
            <div class="wind">${wind}</div>
            <div class="precipitation">${precipitation}</div>
          </div>
        </div>
      `);
    }

    let colorStyles: TemplateResult | null = null;
    if (this.colors) {
      colorStyles = this.getColorStyles(this.colors);
    }

    return html`
      <div class="main">
        ${colorStyles ?? null}
        ${this.hide_bar ? null : html`
          <div class="bar-shell">
            <div class="bar">${conditionBars}</div>
            ${showBarOverlay ? this.renderBarOverlay() : null}
          </div>
        `}
        <div class="axes">${barBlocks}</div>
      </div>
    `;
  }

  private getConditionIcon(condition: DisplayCondition): string {
    const customIcon = this.icon_map?.[condition];
    if (customIcon) return customIcon;

    const configuredIcon = ICONS[condition];
    return configuredIcon === condition
      ? `mdi:weather-${configuredIcon}`
      : `mdi:${configuredIcon}`;
  }

  private renderBarOverlay(): TemplateResult {
    const amountFontSize = Number(this.precipitation_amount_font_size) > 0
      ? Number(this.precipitation_amount_font_size)
      : 11;
    const probabilityFontSize = Number(this.precipitation_probability_font_size) > 0
      ? Number(this.precipitation_probability_font_size)
      : 10;

    return html`
      <div class="bar-overlay">
        ${this.segment_conditions.map((condition, index) => {
          const skipLabel = index % this.label_spacing !== 0;
          if (skipLabel) return html`<div class="bar-overlay-item"></div>`;

          const values = this.precipitation[index];
          const showAmount = this.show_precipitation_amounts && values?.precipitationAmount;
          const showProbability = this.show_precipitation_probability && values?.precipitationProbability;
          const accessibleValues = [
            this.labels[condition],
            showAmount ? values.precipitationAmount : '',
            showProbability ? values.precipitationProbabilityText : '',
          ].filter(Boolean).join(', ');
          return html`
            <div class="bar-overlay-item" role="img" aria-label=${accessibleValues}>
              <div
                class=${showAmount || showProbability ? 'bar-overlay-content' : 'bar-overlay-content no-values'}
                aria-hidden="true"
              >
                <ha-icon icon=${this.getConditionIcon(condition)}></ha-icon>
                ${showAmount || showProbability ? html`
                  <span class="bar-precipitation-stack">
                    ${showAmount ? html`
                      <span class="bar-precipitation-amount" style=${styleMap({ fontSize: `${amountFontSize}px` })}>
                        ${values.precipitationAmount}
                      </span>
                    ` : null}
                    ${showProbability ? html`
                      <span
                        class="bar-precipitation-probability"
                        title=${values.precipitationProbabilityText}
                        style=${styleMap({ fontSize: `${probabilityFontSize}px` })}
                      >${values.precipitationProbability}</span>
                    ` : null}
                  </span>
                ` : null}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  protected update(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.update(changedProperties);

    this.tips.forEach(t => t.destroy());

    this.tips = tippy(this.renderRoot.querySelectorAll('.bar > div'), {
      appendTo: this.renderRoot.firstElementChild || void 0,
      touch: 'hold'
    });
  }

  private getColorStyles(colors: ColorMap): TemplateResult | null {
    if (!colors || colors.size === 0) return null;
    const vars: string[] = [];
    for (const [key, color] of colors.entries()) {
      if (color.background)
        vars.push(`--color-${key}: ${color.background};`);
      if (color.foreground)
        vars.push(`--color-${key}-foreground: ${color.foreground};`);
    }
    return html`<style>
      .main > .bar-shell > .bar {
        ${unsafeCSS(vars.join(' '))}
      }
    </style>`;
  }

  private getWindBarb(speed: number, direction: number): TemplateResult {
    const svgStyles = {
      transform: `rotate(${direction}deg)`
    };
    return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 40 120 120" class="barb" style=${styleMap(svgStyles)}>
      ${getWindBarbSVG(speed)}
    </svg>`;
  }

  static styles = [unsafeCSS(tippyStyles), css`
    .main {
      --color-clear-night: #111;
      --color-cloudy: #777777;
      --color-fog: var(--color-cloudy);
      --color-hail: #2b5174;
      --color-lightning: var(--color-rainy);
      --color-lightning-rainy: var(--color-rainy);
      --color-partlycloudy: #b3dbff;
      --color-night-partly-cloudy: #333;
      --color-pouring: var(--color-rainy);
      --color-rainy: #44739d;
      --color-snowy: white;
      --color-snowy-rainy: var(--color-partlycloudy);
      --color-sunny: #90cbff;
      --color-windy: var(--color-sunny);
      --color-windy-variant: var(--color-sunny);
      --color-exceptional: #ff9d00;
    }
    .bar {
      height: 30px;
      width: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
    }
    .bar-shell {
      position: relative;
    }
    .bar-overlay {
      position: absolute;
      inset: 0;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      pointer-events: none;
      color: var(--primary-text-color);
      text-shadow: 1px 1px 2px var(--primary-background-color);
    }
    .bar-overlay-item {
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bar-overlay-content {
      width: 100%;
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
      white-space: nowrap;
    }
    .bar-overlay-content.no-values {
      display: flex;
      justify-content: center;
    }
    .bar-overlay-content > ha-icon {
      flex: 0 0 auto;
      justify-self: end;
      margin-right: 0.15rem;
      --mdc-icon-size: 22px;
      filter: drop-shadow(1px 1px 3px var(--primary-background-color));
    }
    .bar-precipitation-stack {
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      justify-self: start;
      margin-left: 0.15rem;
      line-height: 1;
    }
    .bar > div {
      height: 30px;
      text-align: center;
      align-items: center;
      display: grid;
    }
    .condition-label {
      display: inline-block;
      text-shadow: 1px 1px 2px var(--primary-background-color);
      max-width: max(0px, calc((100% - 120px) * 999));
      overflow: hidden;
    }
    .condition-icon {
      display: inline-block;
      max-width: max(0px, calc((100% - 40px) * 999));
      overflow: hidden;
    }
    .condition-icon > ha-icon {
      filter: drop-shadow(1px 1px 3px var(--primary-background-color));
    }
    .bar > div:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    .bar > div:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .clear-night {
      background-color: var(--color-clear-night);
      color: var(--color-clear-night-foreground, var(--primary-text-color));
    }
    .cloudy {
      background-color: var(--color-cloudy);
      color: var(--color-cloudy-foreground, var(--primary-text-color));
    }
    .fog {
      background-color: var(--color-fog);
      color: var(--color-fog-foreground, var(--primary-text-color));
    }
    .hail {
      background-color: var(--color-hail);
      color: var(--color-hail-foreground, var(--primary-text-color));
    }
    .lightning {
      background-color: var(--color-lightning);
      color: var(--color-lightning-foreground, var(--primary-text-color));
    }
    .lightning-rainy {
      background-color: var(--color-lightning-rainy);
      color: var(--color-lightning-rainy-foreground, var(--primary-text-color));
    }
    .partlycloudy {
      background-color: var(--color-partlycloudy);
      color: var(--color-partlycloudy-foreground, var(--primary-text-color));
    }
    .night-partly-cloudy {
      background-color: var(--color-night-partly-cloudy);
      color: var(--color-night-partly-cloudy-foreground, var(--primary-text-color));
    }
    .pouring {
      background-color: var(--color-pouring);
      color: var(--color-pouring-foreground, var(--primary-text-color));
    }
    .rainy {
      background-color: var(--color-rainy);
      color: var(--color-rainy-foreground, var(--primary-text-color));
    }
    .snowy {
      background-color: var(--color-snowy);
      color: var(--color-snowy-foreground, var(--primary-text-color));
    }
    .snowy-rainy {
      background-color: var(--color-snowy-rainy);
      color: var(--color-snowy-rainy-foreground, var(--primary-text-color));
    }
    .sunny {
      background-color: var(--color-sunny);
      color: var(--color-sunny-foreground, var(--primary-text-color));
    }
    .windy {
      background-color: var(--color-windy);
      color: var(--color-windy-foreground, var(--primary-text-color));
    }
    .windy-variant {
      background-color: var(--color-windy-variant);
      color: var(--color-windy-variant-foreground, var(--primary-text-color));
    }
    .exceptional {
      background-color: var(--color-exceptional);
      color: var(--color-exceptional-foreground, var(--primary-text-color));
    }
    .axes {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      margin-top: 5px;
    }
    .bar-block {
      display: inline-grid;
      grid-template-areas:
        'left right'
        'bottom bottom';
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 5px auto;
    }
    .bar-block-left {
      grid-area: left;
      border: 1px solid var(--divider-color, lightgray);
      border-width: 0 1px 0 0;
    }
    .bar-block-right {
      grid-area: right;
      border: 1px solid var(--divider-color, lightgray);
      border-width: 0 0 0 1px;
    }
    .bar-block-bottom {
      text-align: center;
      grid-area: bottom;
      padding-top: 5px;
    }
    .date, .hour {
      color: var(--secondary-text-color, gray);
      font-size: 0.9rem;
      white-space: nowrap;
    }
    .temperature {
      font-size: 1.1rem;
    }
    .wind,
    .precipitation {
      font-size: 0.9rem;
      line-height: 1.1rem;
      padding-top: 0.1rem;
    }
    .barb {
      transform-box: fill-box;
      transform-origin: center;
      height: 3rem;
    }
    .svg-wb, .svg-wb-fill {
      fill: var(--primary-text-color, black);
    }
    .svg-wb, .svg-wb-stroke {
      stroke: var(--primary-text-color, black);
    }
    .svg-wb {
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
    }
  `];
}
