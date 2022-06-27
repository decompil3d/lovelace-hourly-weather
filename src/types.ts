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
  test_gui?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface ForecastHour {
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
  temperature: number
}
