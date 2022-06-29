# Hourly Weather Card by [@decompil3d](https://www.github.com/decompil3d)

An hourly weather card for Home Assistant. Visualize upcoming weather conditions as a colored horizontal bar.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

[![Discord][discord-shield]][discord]
[![Community Forum][forum-shield]][forum]

![Screenshot of Hourly Weather card](hourly-weather.png)
_Can you tell that I live in Seattle?_ 😭

## Installation

### Easiest method:

✨ Install via HACS

### Alternative method:

1. Download `hourly-weather.js` from the [Releases][releases] page
2. Upload to `/www/hourly-weather/hourly-weather.js` (via Samba, File Editor, SSH, etc.)
3. Visit the Resources page in your Home Assistant install and add `/hourly-weather/hourly-weather.js` as a
   JavaScript Module.
   [![Open your Home Assistant instance and show your dashboard resources.](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)
4. Refresh your browser

## Usage

This card will show in the "Add card" modal. It has a GUI editor for configuring settings.

If you prefer YAML, here is a sample config:

```yaml
type: custom:hourly-weather
entity: weather.my_hourly_weather_entity
num_hours: 18 # optional, defaults to 12
name: Next 18 hours # optional, defaults to "Hourly Weather"
```

### Choosing the right entity

This card is focused on displaying hourly weather data. If you try selecting a weather entity that provides daily
forecasts, it will show a warning. I've tested with the OpenWeatherMap integration using the `onecall_hourly` mode and
that works very well.

> ℹ️ NOTE: If your selected weather entity provides forecasts in increments of greater than one hour at a time, each segment
> of the bar will be for one segment, not one hour.

If you already use OpenWeatherMap for daily data, you can add a second integration of the same
component for hourly -- just adjust the latitude or longitude a tiny bit (i.e. change the last decimal by 1).
Otherwise, the integration may complain of a duplicate unique ID.

## Options

| Name              | Type   | Requirement  | Description                                  | Default             |
| ----------------- | ------ | ------------ | -------------------------------------------- | ------------------- |
| type              | string | **Required** | `custom:hourly-weather`                      |                     |
| entity            | string | **Required** | Home Assistant weather entity ID.            |                     |
| name              | string | **Optional** | Card name                                    | `Hourly Weather`    |
| icons             | bool   | **Optional** | Whether to show icons instead of text labels | `false`             |
| num_hours         | number | **Optional** | Number of hours to show (even integer >= 2)  | `12`                |
| colors            | object | **Optional** | Set colors for all or some conditions        |                     |
| tap_action        | object | **Optional** | Action to take on tap                        | `action: more-info` |
| hold_action       | object | **Optional** | Action to take on hold                       | `none`              |
| double_tap_action | object | **Optional** | Action to take on double tap                 | `none`              |

## Action Options

| Name            | Type   | Requirement  | Description                                                                                        | Default     |
| --------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------- | ----------- |
| action          | string | **Required** | Action to perform (more-info, toggle, call-service, navigate url, none)                            | `more-info` |
| navigation_path | string | **Optional** | Path to navigate to (e.g. /lovelace/0/) when action defined as navigate                            | `none`      |
| url             | string | **Optional** | URL to open on click when action is url. The URL will open in a new tab                            | `none`      |
| service         | string | **Optional** | Service to call (e.g. media_player.media_play_pause) when action defined as call-service           | `none`      |
| service_data    | object | **Optional** | Service data to include (e.g. entity_id: media_player.bedroom) when action defined as call-service | `none`      |
| haptic          | string | **Optional** | Haptic feedback _success, warning, failure, light, medium, heavy, selection_                       | `none`      |
| repeat          | number | **Optional** | How often to repeat the `hold_action` in milliseconds.                                             | `none`      |

## Color Options

`colors` is specified as an object containing one or more of the keys listed below and values that are valid CSS colors. Invalid color values will cause an error.

| key | default |
| ----------------- | -------------- |
| `clear-night` | `#000` |
| `cloudy` | `#777` |
| `fog` | same as `cloudy` |
| `hail` | `#2b5174` |
| `lightning` | same as `rainy` |
| `lightning-rainy` | same as `rainy` |
| `partlycloudy` | `#9e9e9e` |
| `pouring` | same as `rainy` |
| `rainy` | `#44739d` |
| `snowy` | `#fff` |
| `snowy-rainy` | same as `partlycloudy` |
| `sunny` | `#90cbff` |
| `windy` | same as `sunny` |
| `windy-variant` | same as `sunny` |
| `exceptional` | `#ff9d00` |

[commits-shield]: https://img.shields.io/github/commit-activity/y/decompil3d/lovelace-hourly-weather.svg?style=for-the-badge
[commits]: https://github.com/decompil3d/lovelace-hourly-weather/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[discord]: https://discord.gg/5e9yvq
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/c/projects/frontend
[license-shield]: https://img.shields.io/github/license/decompil3d/lovelace-hourly-weather.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2022.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/decompil3d/lovelace-hourly-weather.svg?style=for-the-badge
[releases]: https://github.com/decompil3d/lovelace-hourly-weather/releases
