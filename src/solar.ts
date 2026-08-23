/**
 * Solar position math, used to decide whether a forecast segment falls during
 * the day or during the night.
 *
 * Everything here works purely on the epoch milliseconds of a `Date`. There is
 * deliberately no local-date arithmetic and no locale-formatted date string
 * involved: a previous implementation derived a reference day via
 * `new Date(when.toLocaleDateString())`, which produces `Invalid Date` in every
 * locale whose short date format `Date`'s parser does not understand (`de-DE`
 * `13.6.2024`, `en-GB` `13/06/2024`, `nl-NL` `13-6-2024`, ...). Sunrise/sunset
 * then came out as `NaN`, every comparison against them was `false`, and so
 * every segment was treated as night. See #692.
 */

const DEG = Math.PI / 180;

/** Julian day number of the J2000.0 epoch. */
const J2000 = 2451545;

/** Milliseconds in a day. */
const MS_PER_DAY = 86400000;

/**
 * Apparent elevation of the sun's upper limb at sunrise/sunset, in degrees.
 * Home Assistant's `sun.sun` uses the same value to flip between
 * `above_horizon` and `below_horizon`, so the card agrees with it.
 */
export const HORIZON_ELEVATION = -0.833;

/**
 * Elevation of the sun above the horizon, in degrees, for a point in time and
 * a position on earth. Accurate to a few hundredths of a degree, which is far
 * more than enough to tell day from night.
 *
 * @param when Point in time to evaluate.
 * @param latitude Degrees north of the equator.
 * @param longitude Degrees east of Greenwich.
 */
export function solarElevation(when: Date, latitude: number, longitude: number): number {
  // Days since J2000.0, derived from epoch millis so no timezone or locale
  // handling can creep in.
  const d = when.getTime() / MS_PER_DAY + 2440587.5 - J2000;

  // Sun's position in ecliptic coordinates.
  const meanLongitude = (280.46 + 0.9856474 * d) % 360;
  const meanAnomaly = ((357.528 + 0.9856003 * d) % 360) * DEG;
  const eclipticLongitude = (meanLongitude
    + 1.915 * Math.sin(meanAnomaly)
    + 0.02 * Math.sin(2 * meanAnomaly)) * DEG;
  const obliquity = (23.439 - 0.0000004 * d) * DEG;

  // ...converted to equatorial coordinates.
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude));
  const rightAscension = Math.atan2(
    Math.cos(obliquity) * Math.sin(eclipticLongitude),
    Math.cos(eclipticLongitude));

  // Greenwich mean sidereal time, in hours, then the local hour angle.
  let gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  if (gmst < 0) gmst += 24;
  const hourAngle = gmst * 15 * DEG + longitude * DEG - rightAscension;

  const lat = latitude * DEG;
  return Math.asin(
    Math.sin(lat) * Math.sin(declination)
    + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle)) / DEG;
}

/**
 * Whether the sun is above the horizon at the given time and place.
 */
export function isDaytime(when: Date, latitude: number, longitude: number): boolean {
  return solarElevation(when, latitude, longitude) > HORIZON_ELEVATION;
}
