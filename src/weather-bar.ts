import { LitElement, html, css, TemplateResult, unsafeCSS, PropertyValueMap } from "lit";
import { property } from "lit/decorators.js";
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import tippy, { Instance } from 'tippy.js';
import { LABELS, ICONS } from "./conditions";
import type { ColorMap, ConditionSpan, SegmentTemperature } from "./types";

const tippyStyles: string = process.env.TIPPY_CSS || '';

export class WeatherBar extends LitElement {
  @property({ type: Array })
  conditions: ConditionSpan[] = [];

  @property({ type: Array })
  temperatures: SegmentTemperature[] = [];

  @property({ type: Boolean })
  icons = false;

  @property({ type: Object })
  colors: ColorMap | undefined = void 0;

  @property({ type: Boolean })
  hide_hours = false;

  @property({ type: Boolean })
  hide_temperatures = false;

  private tips: Instance[] = [];

  render() {
    const conditionBars: TemplateResult[] = [];
    let gridStart = 1;
    for (const cond of this.conditions) {
      const label = LABELS[cond[0]];
      let icon = ICONS[cond[0]];
      if (icon === cond[0]) icon = 'mdi:weather-' + icon;
      else icon = 'mdi:' + icon;
      const barStyles: Readonly<StyleInfo> = { gridColumnStart: String(gridStart), gridColumnEnd: String(gridStart += cond[1]) };
      conditionBars.push(html`
        <div class=${cond[0]} style=${styleMap(barStyles)} data-tippy-content=${label}>
          ${this.icons ?
          html`<span class="condition-icon"><ha-icon icon=${icon}></ha-icon></span>` :
          html`<span class="condition-label">${label}</span>`}
        </div>
      `);
    }

    const barBlocks: TemplateResult[] = [];
    for (let i = 1; i < this.temperatures.length; i += 2) {
      const { hour, temperature } = this.temperatures[i];
      barBlocks.push(html`
        <div class="bar-block">
          <div class="bar-block-left"></div>
          <div class="bar-block-right"></div>
          <div class="bar-block-bottom">
            <div class="hour">${this.hide_hours ? null : hour}</div>
            <div class="temperature">${this.hide_temperatures ? null : html`${temperature}&deg;`}</div>
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
        <div class="bar">${conditionBars}</div>
        <div class="axes">${barBlocks}</div>
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
      vars.push(`--color-${key}: ${color};`);
    }
    return html`<style>
      .main > .bar {
        ${unsafeCSS(vars.join(' '))}
      }
    </style>`;
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
    }
    .cloudy {
      background-color: var(--color-cloudy);
    }
    .fog {
      background-color: var(--color-fog);
    }
    .hail {
      background-color: var(--color-hail);
    }
    .lightning {
      background-color: var(--color-lightning);
    }
    .lightning-rainy {
      background-color: var(--color-lightning-rainy);
    }
    .partlycloudy {
      background-color: var(--color-partlycloudy);
    }
    .pouring {
      background-color: var(--color-pouring);
    }
    .rainy {
      background-color: var(--color-rainy);
    }
    .snowy {
      background-color: var(--color-snowy);
    }
    .snowy-rainy {
      background-color: var(--color-snowy-rainy);
    }
    .sunny {
      background-color: var(--color-sunny);
    }
    .windy {
      background-color: var(--color-windy);
    }
    .windy-variant {
      background-color: var(--color-windy-variant);
    }
    .exceptional {
      background-color: var(--color-exceptional);
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
      border-width: 0 1px;
    }
    .bar-block-right {
      grid-area: right;
    }
    .bar-block:last-child .bar-block-right {
      border-right: 1px solid var(--divider-color, lightgray);
    }
    .bar-block-bottom {
      text-align: center;
      grid-area: bottom;
      padding-top: 5px;
    }
    .hour {
      color: var(--secondary-text-color, gray);
      font-size: 0.9rem;
    }
    .temperature {
      font-size: 1.1rem;
    }
  `];
}
