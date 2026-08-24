/**
 * Solar position math, used to decide whether a forecast segment falls during
 * the day or during the night.
 *
 * This is the standard low-precision solar position approximation: derive the
 * sun's ecliptic longitude from its mean longitude plus a two-term equation of
 * center, rotate into equatorial coordinates using the obliquity of the
 * ecliptic, then combine with sidereal time and the observer's latitude to get
 * an elevation. It is good to a fraction of a degree, and only the sign of the
 * result matters here.
 *
 * Everything works purely on the epoch milliseconds of a `Date`. There is
 * deliberately no local-date arithmetic and no locale-formatted date string
 * involved: a previous implementation derived a reference day via
 * `new Date(when.toLocaleDateString())`, which produces `Invalid Date` in every
 * locale whose short date format `Date`'s parser does not understand (`de-DE`
 * `13.6.2024`, `en-GB` `13/06/2024`, `nl-NL` `13-6-2024`, ...). Sunrise/sunset
 * then came out as `NaN`, every comparison against them was `false`, and so
 * every segment was treated as night. See #692.
 */

// --- Unit conversions -------------------------------------------------------

const DEG_TO_RAD = Math.PI / 180;
const DEGREES_PER_TURN = 360;
const HOURS_PER_TURN = 24;
const MS_PER_DAY = 86400000;

/** Degrees the earth turns per hour: 360 / 24. */
const DEGREES_PER_HOUR = 15;

// --- Epochs -----------------------------------------------------------------

/** Julian day number of J2000.0, the epoch every term below is relative to. */
const JULIAN_DAY_J2000 = 2451545;

/** Julian day number of the Unix epoch, 1970-01-01T00:00:00Z. */
const JULIAN_DAY_UNIX_EPOCH = 2440587.5;

// --- Sun's mean longitude, in degrees ---------------------------------------

const MEAN_LONGITUDE_AT_J2000 = 280.46;
const MEAN_LONGITUDE_PER_DAY = 0.9856474;

// --- Sun's mean anomaly, in degrees -----------------------------------------

const MEAN_ANOMALY_AT_J2000 = 357.528;
const MEAN_ANOMALY_PER_DAY = 0.9856003;

// --- Equation of center, in degrees -----------------------------------------
// Corrects the mean longitude for the eccentricity of earth's orbit. Two terms
// are plenty at this precision.

const EQUATION_OF_CENTER_1ST_ORDER = 1.915;
const EQUATION_OF_CENTER_2ND_ORDER = 0.02;

// --- Obliquity of the ecliptic, in degrees ----------------------------------
// The tilt of earth's axis, which is slowly decreasing.

const OBLIQUITY_AT_J2000 = 23.439;
const OBLIQUITY_DECREASE_PER_DAY = 0.0000004;

// --- Greenwich mean sidereal time, in hours ---------------------------------
// A sidereal day is slightly shorter than a solar day, hence the value just
// over 24 hours per day.

const GMST_AT_J2000_HOURS = 18.697374558;
const GMST_PER_DAY_HOURS = 24.06570982441908;

// --- Horizon ----------------------------------------------------------------

/**
 * Apparent elevation of the sun's upper limb at sunrise/sunset, in degrees.
 * Home Assistant's `sun.sun` uses the same value to flip between
 * `above_horizon` and `below_horizon`, so the card agrees with it.
 */
export const HORIZON_ELEVATION = -0.833;

/**
 * Elevation of the sun above the horizon, in degrees, for a point in time and
 * a position on earth.
 *
 * @param when Point in time to evaluate.
 * @param latitude Degrees north of the equator.
 * @param longitude Degrees east of Greenwich.
 */
export function solarElevation(when: Date, latitude: number, longitude: number): number {
  // Days since J2000.0, derived from epoch millis so no timezone or locale
  // handling can creep in.
  const daysSinceJ2000 = when.getTime() / MS_PER_DAY
    + JULIAN_DAY_UNIX_EPOCH - JULIAN_DAY_J2000;

  // Where the sun is along the ecliptic.
  const meanLongitude = (MEAN_LONGITUDE_AT_J2000
    + MEAN_LONGITUDE_PER_DAY * daysSinceJ2000) % DEGREES_PER_TURN;
  const meanAnomaly = ((MEAN_ANOMALY_AT_J2000
    + MEAN_ANOMALY_PER_DAY * daysSinceJ2000) % DEGREES_PER_TURN) * DEG_TO_RAD;
  const eclipticLongitude = (meanLongitude
    + EQUATION_OF_CENTER_1ST_ORDER * Math.sin(meanAnomaly)
    + EQUATION_OF_CENTER_2ND_ORDER * Math.sin(2 * meanAnomaly)) * DEG_TO_RAD;

  // Rotate from ecliptic into equatorial coordinates.
  const obliquity = (OBLIQUITY_AT_J2000
    - OBLIQUITY_DECREASE_PER_DAY * daysSinceJ2000) * DEG_TO_RAD;
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude));
  const rightAscension = Math.atan2(
    Math.cos(obliquity) * Math.sin(eclipticLongitude),
    Math.cos(eclipticLongitude));

  // How far the observer's meridian has turned past the sun.
  let gmstHours = (GMST_AT_J2000_HOURS
    + GMST_PER_DAY_HOURS * daysSinceJ2000) % HOURS_PER_TURN;
  if (gmstHours < 0) gmstHours += HOURS_PER_TURN;
  const hourAngle = gmstHours * DEGREES_PER_HOUR * DEG_TO_RAD
    + longitude * DEG_TO_RAD
    - rightAscension;

  const observerLatitude = latitude * DEG_TO_RAD;
  return Math.asin(
    Math.sin(observerLatitude) * Math.sin(declination)
    + Math.cos(observerLatitude) * Math.cos(declination) * Math.cos(hourAngle)) / DEG_TO_RAD;
}

/**
 * Whether the sun is above the horizon at the given time and place.
 */
export function isDaytime(when: Date, latitude: number, longitude: number): boolean {
  return solarElevation(when, latitude, longitude) > HORIZON_ELEVATION;
}
