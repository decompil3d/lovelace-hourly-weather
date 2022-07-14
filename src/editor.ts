/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { HourlyWeatherCardConfig } from './types';
import { customElement, property, state } from 'lit/decorators.js';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';
import { localize } from './localize/localize';

@customElement('hourly-weather-editor')
export class HourlyWeatherCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: HourlyWeatherCardConfig;

  @state() private _helpers?: any;

  private _initialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: HourlyWeatherCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
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

  get _offset(): string {
    return this._config?.offset ?? '0';
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    const entities = Object.keys(this.hass.states).filter(e => e.startsWith('weather.'));

    return html`
      <mwc-select
        naturalMenuWidth
        fixedMenuPosition
        label=${localize('editor.entity')}
        .configValue=${'entity'}
        .value=${this._entity}
        @selected=${this._valueChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        ${entities.map((entity) => {
      return html`<mwc-list-item .value=${entity}>${entity}</mwc-list-item>`;
    })}
      </mwc-select>
      <mwc-textfield
      label=${localize('editor.name')}
        .value=${this._name}
        .configValue=${'name'}
        @input=${this._valueChanged}
      ></mwc-textfield>
      <mwc-textfield
      label=${localize('editor.hours_to_show')}
        .value=${this._numSegments}
        .configValue=${'num_segments'}
        @input=${this._valueChanged}
        .type=${'number'}
        .min=${2}
        .step=${2}
        .pattern=${"([1-9][0-9]*[02468])|([2468])"}
        .autoValidate=${true}
        validationMessage=${localize('errors.must_be_int')}
      ></mwc-textfield>
      <mwc-textfield
      label=${localize('editor.offset')}
        .value=${this._offset}
        .configValue=${'offset'}
        @input=${this._valueChanged}
        .type=${'number'}
        .min=${0}
        .autoValidate=${true}
        validationMessage=${localize('errors.must_be_positive_int')}
      ></mwc-textfield>
      <mwc-formfield .label=${localize('editor.icons')}>
        <mwc-switch
          .checked=${this._icons === true}
          .configValue=${'icons'}
          @change=${this._valueChanged}
        ></mwc-switch>
      </mwc-formfield>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    if ('num_hours' in this._config && 'num_segments' in this._config) {
      // Remove `num_hours` in favor of `num_segments`
      const tmpConfig = { ...this._config };
      delete tmpConfig.num_hours;
      this._config = tmpConfig;
    }
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
