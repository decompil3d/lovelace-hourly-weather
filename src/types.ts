import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'hourly-weather-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export type WindType = 'true' | 'false' | 'speed' | 'direction' | 'barb' | 'barb-and-speed' | 'barb-and-direction' | 'barb-speed-and-direction';
export type ShowDateType = 'false' | 'boundary' | 'all';
export type IconFillType = 'single' | 'full' | number;
export type Condition = 'clear-night' | 'cloudy' | 'fog' | 'hail' | 'lightning' | 'lightning-rainy' | 'partlycloudy' | 'pouring' | 'rainy' | 'snowy' | 'snowy-rainy' | 'sunny' | 'windy' | 'windy-variant' | 'exceptional';
type PerConditionConfig<TValue> = Partial<Record<Condition, TValue>>;
export type IconMap = PerConditionConfig<string>;

export interface HourlyWeatherCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  /** @deprecated Use num_segments instead */
  num_hours?: string; // number
  num_segments?: string; // number
  forecast_type?: ForecastType;
  name?: string;
  icons?: boolean;
  icon_map?: IconMap;
  offset?: string; // number
  colors?: ColorConfig;
  hide_bar?: boolean;
  icon_fill?: IconFillType;
  hide_hours?: boolean;
  hide_minutes?: boolean;
  hide_temperatures?: boolean;
  round_temperatures?: boolean;
  show_wind?: WindType | boolean; // 'true' | 'false' | 'speed' | 'direction' | 'barb' | 'barb-and-speed' | 'barb-and-direction' | 'barb-speed-and-direction'
  show_precipitation_amounts?: boolean;
  show_precipitation_probability?: boolean;
  show_date?: ShowDateType; // 'false' | 'boundary' | 'all'
  label_spacing?: string; // number
  test_gui?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  language?: string;
}

export interface ColorObject {
  foreground?: string;
  background?: string;
}

export type ColorDefinition = string | ColorObject;

export type ColorConfig = PerConditionConfig<ColorDefinition>;

export interface ForecastSegment {
  clouds: number; // 100
  condition: Condition; // "cloudy"
  datetime: string; // "2022-06-03T22:00:00+00:00"
  precipitation: number; // 0
  precipitation_probability: number; // 85
  pressure: number; // 1007
  temperature: number; // 61
  wind_bearing: number | string; // 153 | 'SSW'
  wind_speed: number; // 3.06
}

export type ConditionSpan = [
  condition: Condition,
  span: number
]

export interface SegmentTemperature {
  hour: string;
  date: string;
  temperature: string;
}

export interface SegmentWind {
  hour: string;
  windSpeed: string;
  windSpeedRawMS: number;
  windDirection: string;
  windDirectionRaw: number | string;
}

export interface SegmentPrecipitation {
  hour: string;
  precipitationAmount: string;
  precipitationProbability: string;
  precipitationProbabilityText: string;
}

export type ColorMap = Map<keyof ColorConfig, ColorObject>

export interface ColorSettings {
  validColors?: ColorMap;
  warnings: string[];
}

export interface RenderTemplateResult {
  result: string;
}

export interface LocalizerLastSettings {
  configuredLanguage: string | undefined;
  haServerLanguage: string | undefined;
}

export type ForecastType = "hourly" | "daily" | "twice_daily";

export interface ForecastEvent {
  type: ForecastType;
  forecast: [ForecastSegment] | null;
}
