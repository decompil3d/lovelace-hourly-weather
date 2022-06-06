import { LitElement, html, css, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';
import { localize } from "./localize/localize";
import type { ConditionSpan, HourTemperature } from "./types";

const LABELS = {
  'clear-night': localize('conditions.clear'),
  'cloudy': localize('conditions.cloudy'),
  'fog': localize('conditions.fog'),
  'hail': localize('conditions.hail'),
  'lightning': localize('conditions.thunderstorm'),
  'lightning-rainy': localize('conditions.thunderstorm'),
  'partlycloudy': localize('conditions.partlyCloudy'),
  'pouring': localize('conditions.heavyRain'),
  'rainy': localize('conditions.rain'),
  'snowy': localize('conditions.snow'),
  'snowy-rainy': localize('conditions.mixedPrecip'),
  'sunny': localize('conditions.sunny'),
  'windy': localize('conditions.windy'),
  'windy-variant': localize('conditions.windy'),
  'exceptional': localize('conditions.clear')
}

export class WeatherBar extends LitElement {
  @property({ type: Array })
  conditions: ConditionSpan[] = [];

  @property({ type: Array })
  temperatures: HourTemperature[] = [];

  render() {
    const conditionBars: TemplateResult[] = [];
    let gridStart = 1;
    for (const cond of this.conditions) {
      const label = LABELS[cond[0]];
      const barStyles: Readonly<StyleInfo> = { gridColumnStart: String(gridStart), gridColumnEnd: String(gridStart += cond[1]) };
      conditionBars.push(html`
        <div class=${cond[0]} style=${styleMap(barStyles)} title=${label}>
          <span class="condition-label">${label}</span>
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
            <div class="hour">${hour}</div>
            <div class="temperature">${temperature}&deg;</div>
          </div>
        </div>
      `);
    }

    return html`
      <div class="main">
        <div class="bar">${conditionBars}</div>
        <div class="axes">${barBlocks}</div>
      </div>
    `;
  }

  static styles = css`
    .main {
      --color-clear-night: #111;
      --color-cloudy: #777777;
      --color-fog: var(--color-cloudy);
      --color-hail: #2b5174;
      --color-lightning: var(--color-rainy);
      --color-lightning-rainy: var(--color-rainy);
      --color-partlycloudy: #9e9e9e;
      --color-pouring: var(--color-rainy);
      --color-rainy: #44739d;
      --color-snowy: white;
      --color-snowy-rainy: var(--color-partlycloudy);
      --color-sunny: #efbd08;
      --color-windy: var(--color-sunny);
      --color-windy-variant: var(--color-sunny);
      --color-exceptional: var(--color-sunny);
    }
    .bar {
      height: 30px;
      width: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
    }
    .bar > div {
      height: 100%;
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
    .bar > div:first-child {
      border-radius: 10px 0 0 10px;
    }
    .bar > div:last-child {
      border-radius: 0 10px 10px 0;
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
      color: var(--secondary-text-color, gray);
      text-align: center;
      grid-area: bottom;
      padding-top: 5px;
    }
    .hour {
      font-size: 0.9rem;
    }
    .temperature {
      font-size: 1.1rem;
    }
  `;
}
