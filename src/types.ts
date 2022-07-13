import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'hourly-weather-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface HourlyWeatherCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  num_hours?: number;
  name?: string;
  icons?: boolean;
  offset?: number;
  colors?: ColorConfig;
  test_gui?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface ColorConfig {
  'clear-night'?: string;
  'cloudy'?: string;
  'fog'?: string;
  'hail'?: string;
  'lightning'?: string;
  'lightning-rainy'?: string;
  'partlycloudy'?: string;
  'pouring'?: string;
  'rainy'?: string;
  'snowy'?: string;
  'snowy-rainy'?: string;
  'sunny'?: string;
  'windy'?: string;
  'windy-variant'?: string;
  'exceptional'?: string;
}

export interface ForecastSegment {
  clouds: number; // 100
  condition: string; // "cloudy"
  datetime: string; // "2022-06-03T22:00:00+00:00"
  precipitation: number; // 0
  precipitation_probability: number; // 85
  pressure: number; // 1007
  temperature: number; // 61
  wind_bearing: number; // 153
  wind_speed: number; // 3.06
}

export type ConditionSpan = [
  condition: string,
  span: number
]

export interface HourTemperature {
  hour: string,
  temperature: string
}

export type ColorMap = Map<keyof ColorConfig, string>

export interface ColorSettings {
  validColors?: ColorMap,
  warnings: string[]
}
