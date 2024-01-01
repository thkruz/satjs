/**
 * Full circle in radians (PI * 2)
 *
 * https://tauday.com/tau-manifesto
 */
export const tau: number = 2.0 * Math.PI;

/**
 * Represents half of the mathematical constant PI.
 */
export const halfPi: number = 0.5 * Math.PI;

/**
 * Converts degrees to radians.
 */
export const deg2rad: number = Math.PI / 180.0;

/**
 * Converts radians to degrees.
 */
export const rad2deg: number = 180.0 / Math.PI;

/**
 * Conversion factor from seconds to degrees.
 */
export const sec2deg: number = 1.0 / 60.0 / 60.0;

/**
 * Conversion factor from seconds to days.
 */
export const sec2day: number = sec2deg / 24.0;

/**
 * Conversion factor from arcseconds to radians.
 */
export const asec2rad: number = sec2deg * deg2rad;

/**
 * Convert ten-thousandths of an arcsecond to radians.
 */
export const ttasec2rad: number = asec2rad / 10000.0;

/**
 * Convert milliarcseconds to radians.
 */
export const masec2rad: number = asec2rad / 1000.0;

/**
 * Astronomical unit in kilometers.
 */
export const astronomicalUnit = 149597870.0;

// / Convert milliseconds to seconds.
export const msec2sec = 1e-3;

// / Speed of light _(km/s)_.
export const speedOfLight = 299792.458;

// / Milliseconds per day.
export const msecPerDay = 86400000;

// / Seconds per day.
export const secondsPerDay = 86400.0;

// / Convert seconds to minutes.
export const sec2min: number = 1.0 / 60.0;

// / Seconds per sidereal day.
export const secondsPerSiderealDay = 86164.0905;

// / Seconds per week.
export const secondsPerWeek: number = secondsPerDay * 7.0;

export const { PI } = Math;
export const TAU = PI * 2; // https://tauday.com/tau-manifesto
export const DEG2RAD = PI / 180.0;
export const x2o3 = 2.0 / 3.0;
export const temp4 = 1.5e-12;

export const RAD2DEG = 360 / TAU;
export const MINUTES_PER_DAY = 1440;
export const MS_PER_DAY = 86400000;
export const DAY_TO_MS = 1.15741e-8;
export const cMPerSec = 299792458;
export const cKmPerSec = 299792458 / 1000;
export const cKmPerMs = 299792458 / 1000 / 1000;
export const RADIUS_OF_EARTH = 6371; // Radius of Earth in kilometers
