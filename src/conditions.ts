import type { DayNightVariants, DisplayCondition } from './types';

export const LABELS: Record<DisplayCondition, string> = {
  'clear-night': 'conditions.clear',
  'cloudy': 'conditions.cloudy',
  'fog': 'conditions.fog',
  'hail': 'conditions.hail',
  'lightning': 'conditions.thunderstorm',
  'lightning-rainy': 'conditions.thunderstorm',
  'partlycloudy': 'conditions.partlyCloudy',
  'night-partly-cloudy': 'conditions.partlyCloudyNight',
  'pouring': 'conditions.heavyRain',
  'rainy': 'conditions.rain',
  'snowy': 'conditions.snow',
  'snowy-rainy': 'conditions.mixedPrecip',
  'sunny': 'conditions.sunny',
  'windy': 'conditions.windy',
  'windy-variant': 'conditions.windy',
  'exceptional': 'conditions.clear'
};
export const ICONS: Record<DisplayCondition, string> = {
  'clear-night': 'weather-night',
  'cloudy': 'cloudy',
  'fog': 'fog',
  'hail': 'hail',
  'lightning': 'lightning',
  'lightning-rainy': 'lightning-rainy',
  'partlycloudy': 'weather-partly-cloudy',
  'night-partly-cloudy': 'weather-night-partly-cloudy',
  'pouring': 'pouring',
  'rainy': 'rainy',
  'snowy': 'snowy',
  'snowy-rainy': 'snowy-rainy',
  'sunny': 'sunny',
  'windy': 'windy',
  'windy-variant': 'windy-variant',
  'exceptional': 'alert-outline'
};

/**
 * Conditions that Home Assistant reports without regard for whether the
 * forecast segment falls during the day or during the night, mapped to the
 * daytime and nighttime variant the card should render instead.
 *
 * Weather integrations derive `sunny` vs `clear-night` (and, where they support
 * it at all, partly cloudy) from the sun position *at the time the forecast is
 * produced*, so every segment of an hourly forecast gets the same day/night
 * flavour. Resolving each segment against its own timestamp fixes that.
 */
export const DAY_NIGHT_VARIANTS: Partial<Record<DisplayCondition, DayNightVariants>> = {
  'sunny': ['sunny', 'clear-night'],
  'clear-night': ['sunny', 'clear-night'],
  'partlycloudy': ['partlycloudy', 'night-partly-cloudy'],
  'night-partly-cloudy': ['partlycloudy', 'night-partly-cloudy']
};
