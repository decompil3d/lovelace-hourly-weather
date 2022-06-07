# Hourly Weather Card by [@decompil3d](https://www.github.com/decompil3d)

An hourly weather card for Home Assistant. Visualize upcoming weather conditions as a colored horizontal bar.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

[![Discord][discord-shield]][discord]
[![Community Forum][forum-shield]][forum]

## Options

| Name              | Type   | Requirement  | Description                                 | Default             |
| ----------------- | ------ | ------------ | ------------------------------------------- | ------------------- |
| type              | string | **Required** | `custom:hourly-weather`                     |                     |
| entity            | string | **Required** | Home Assistant weather entity ID.           |                     |
| name              | string | **Optional** | Card name                                   | Weather entity name |
| num_hours         | number | **Optional** | Number of hours to show (even integer >= 2) | `12`                |
| tap_action        | object | **Optional** | Action to take on tap                       | `action: more-info` |
| hold_action       | object | **Optional** | Action to take on hold                      | `none`              |
| double_tap_action | object | **Optional** | Action to take on double tap                | `none`              |

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
