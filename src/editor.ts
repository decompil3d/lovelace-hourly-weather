/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { HourlyWeatherCardConfig, WindType } from './types';
import { customElement, property, state } from 'lit/decorators.js';
import { getLocalizer } from './localize/localize';

interface HaFormSchema {
  name: string;
  label?: string;
  selector?: Record<string, any>;
  required?: boolean;
  type?: string;
  default?: any;
}

@customElement('hourly-weather-editor')
export class HourlyWeatherCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: HourlyWeatherCardConfig;

  @state() private _helpers?: any;

  private _initialized = false;

  public async setConfig(config: HourlyWeatherCardConfig): Promise<void> {
    this._config = config;

    await this.loadCardHelpers();
    this.requestUpdate();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _name(): string {
    return this._config?.name || '';
  }

  get _entity(): string {
    return this._config?.entity || '';
  }

  get _numSegments(): string {
    return this._config?.num_segments ?? this._config?.num_hours ?? '12';
  }

  get _icons(): boolean {
    return this._config?.icons ?? false;
  }

  get _show_wind(): WindType {
    const showWind = this._config?.show_wind;
    if (typeof showWind === 'boolean') {
      return showWind ? 'true' : 'false';
    }
    return showWind ?? 'false';
  }

  get _show_precipitation_amounts(): boolean {
    return this._config?.show_precipitation_amounts ?? false;
  }

  get _show_precipitation_probability(): boolean {
    return this._config?.show_precipitation_probability ?? false;
  }

  get _offset(): string {
    return this._config?.offset ?? '0';
  }

  get _labelSpacing(): string {
    return this._config?.label_spacing ?? '2';
  }

  get _show_date(): string {
    return this._config?.show_date ?? 'false';
  }

  private getSchema(localize: ReturnType<typeof getLocalizer>): HaFormSchema[] {
    return [
      {
        name: 'entity',
        selector: {
          entity: {
            domain: 'weather', // Automatically filters weather entities from HASS!
          },
        },
      },
      {
        name: 'name',
        selector: { text: {} },
      },
      {
        name: 'num_segments',
        selector: {
          number: {
            min: 1,
            step: 1,
            mode: 'box',
          },
        },
      },
      {
        name: 'offset',
        selector: {
          number: {
            min: 0,
            step: 1,
            mode: 'box',
          },
        },
      },
      {
        name: 'label_spacing',
        selector: {
          number: {
            min: 1,
            step: 1,
            mode: 'box',
          },
        },
      },
      {
        name: 'icons',
        selector: { boolean: {} },
      },
      {
        name: 'auto_label_spacing',
        selector: { boolean: {} },
      },
      {
        name: 'show_wind',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'false', label: localize('editor.none') },
              { value: 'true', label: localize('editor.speed_and_direction') },
              { value: 'speed', label: localize('editor.speed_only') },
              { value: 'direction', label: localize('editor.direction_only') },
              { value: 'barb', label: localize('editor.barb') },
              { value: 'barb-and-speed', label: localize('editor.barb_and_speed') },
              { value: 'barb-and-direction', label: localize('editor.barb_and_direction') },
              { value: 'barb-speed-and-direction', label: localize('editor.barb_speed_and_direction') },
            ],
          },
        },
      },
      {
        name: 'show_date',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'false', label: localize('editor.none') },
              { value: 'all', label: localize('editor.all') },
              { value: 'boundary', label: localize('editor.on_day_boundaries') },
            ],
          },
        },
      },
      {
        name: 'show_precipitation_amounts',
        selector: { boolean: {} },
      },
      {
        name: 'show_precipitation_probability',
        selector: { boolean: {} },
      },
    ];
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    const localize = getLocalizer(this._config?.language, this.hass?.locale?.language);
    const schema = this.getSchema(localize);

    // Compute labels dynamically using localized key lookup
    const computeLabel = (schemaItem: HaFormSchema) => {
      // You can define a fallback or mapping logic for field names -> localization keys
      const labelMap: Record<string, string> = {
        entity: localize('editor.entity'),
        name: localize('editor.name'),
        num_segments: localize('editor.segments_to_show'),
        offset: localize('editor.offset'),
        label_spacing: localize('editor.label_spacing'),
        icons: localize('editor.icons'),
        auto_label_spacing: localize('editor.auto_label_spacing'),
        show_wind: localize('editor.show_wind'),
        show_date: localize('editor.show_date'),
        show_precipitation_amounts: localize('editor.show_precipitation_amounts'),
        show_precipitation_probability: localize('editor.show_precipitation_probability'),
      };

      return labelMap[schemaItem.name] || schemaItem.name;
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    if (this._helpers && customElements.get('ha-form')) {
      return;
    }
    this._helpers = await (window as any).loadCardHelpers();
    this._helpers.createCardElement({
      type: 'entities',
      entities: []
    });
    await customElements.whenDefined('ha-form');
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    
    const newConfig = {
      ...ev.detail.value
    };

    // Clean up empty string values (so they get removed from config instead of lingering as empty keys)
    Object.keys(newConfig).forEach((key) => {
      if (newConfig[key] === '' || newConfig[key] === undefined) {
        delete newConfig[key];
      }
    });

    // Remove obsolete `num_hours` in favor of `num_segments`
    if ('num_hours' in newConfig && 'num_segments' in newConfig) {
      delete newConfig.num_hours;
    }

    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static styles: CSSResultGroup = css`
    mwc-select,
    mwc-textfield {
      margin-bottom: 16px;
      display: block;
    }
    mwc-formfield {
      padding-bottom: 8px;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
  `;
}
