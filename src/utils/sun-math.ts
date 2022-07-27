import { DEG2RAD, PI } from './constants';
/* eslint-disable max-params */
import { Degrees, Radians } from '../ootk';

type AzEl = {
  az: Radians;
  el: Radians;
};

type Meters = number;

type SunTime = {
  solarNoon: Date;
  nadir: Date;
};

/* eslint-disable no-param-reassign */
export class SunMath {
  private static readonly J1970 = 2440588;
  private static readonly J2000 = 2451545;
  private static readonly J0 = 0.0009;
  private static readonly MS_IN_DAY = 86400000;
  private static readonly PI = Math.PI;
  private static readonly TAU = Math.PI * 2;
  private static readonly e = DEG2RAD * 23.4397;

  static getStarAzEl(date: Date, lat: Degrees, lon: Degrees, ra: number, dec: number): AzEl {
    const lw = -lon * DEG2RAD;
    const phi = lat * DEG2RAD;
    const d = SunMath.toDays(date);
    const H = SunMath.siderealTime(d, lw) - (ra / 12) * SunMath.PI;
    let h = SunMath.elevation(H, phi, (dec / 180) * SunMath.PI);

    h += SunMath.astroRefraction(h); // elevation correction for refraction

    return {
      az: SunMath.azimuth(H, phi, (dec / 180) * Math.PI),
      el: h,
    };
  }

  static getSunAzEl(date: Date, lat: Degrees, lon: Degrees): AzEl {
    const lw = -lon * DEG2RAD;
    const phi = lat * DEG2RAD;
    const d = SunMath.toDays(date);
    const c = SunMath.getSunRaDec(d);
    const H = SunMath.siderealTime(d, lw) - c.ra;

    return {
      az: SunMath.azimuth(H, phi, c.dec),
      el: SunMath.elevation(H, phi, c.dec),
    };
  }

  private static times = [
    [-0.833, 'sunrise', 'sunset'],
    [-0.3, 'sunriseEnd', 'sunsetStart'],
    [-6, 'dawn', 'dusk'],
    [-12, 'nauticalDawn', 'nauticalDusk'],
    [-18, 'nightEnd', 'night'],
    [6, 'goldenHourEnd', 'goldenHour'],
  ];

  // eslint-disable-next-line max-statements
  static getTimes(date: Date, lat: Degrees, lon: Degrees, alt: Meters): SunTime {
    alt = alt || 0;

    const lw = DEG2RAD * -lon;
    const phi = DEG2RAD * lat;
    const dh = SunMath.observerAngle(alt);
    const d = SunMath.toDays(date);
    const n = SunMath.julianCycle(d, lw);
    const ds = SunMath.approxTransit(0, lw, n);
    const M = SunMath.solarMeanAnomaly(ds);
    const L = SunMath.eclipticLongitude(M);
    const dec = SunMath.declination(L, 0);
    const Jnoon = SunMath.solarTransitJulian(ds, M, L);
    let i = 0;
    let len = 0;
    let time = [];
    let h0 = 0;
    let Jset = 0;
    let Jrise = 0;

    const result = {
      solarNoon: SunMath.julian2date(Jnoon),
      nadir: SunMath.julian2date(Jnoon - 0.5),
    };

    for (i = 0, len = SunMath.times.length; i < len; i += 1) {
      time = SunMath.times[i];
      h0 = (time[0] + dh) * DEG2RAD;

      Jset = SunMath.getSetJ(h0, lw, phi, dec, n, M, L);
      Jrise = Jnoon - (Jset - Jnoon);

      result[time[1]] = SunMath.julian2date(Jrise);
      result[time[2]] = SunMath.julian2date(Jset);
    }

    return result;
  }

  private static observerAngle(alt: Meters): Degrees {
    return (-2.076 * Math.sqrt(alt)) / 60;
  }
  // returns set time for the given sun altitude
  private static getSetJ(h, lw, phi, dec, n, M, L) {
    const w = SunMath.hourAngle(h, phi, dec);
    const a = SunMath.approxTransit(w, lw, n);

    return SunMath.solarTransitJulian(a, M, L);
  }

  private static julianCycle(d: number, lw: number): number {
    return Math.round(d - SunMath.J0 - lw / (2 * PI));
  }

  static date2julian(date: Date): number {
    return date.valueOf() / SunMath.MS_IN_DAY - 0.5 + SunMath.J1970;
  }

  static julian2date(julian: number): Date {
    return new Date((julian + 0.5 - SunMath.J1970) * SunMath.MS_IN_DAY);
  }

  static toDays(date: Date): number {
    return this.date2julian(date) - SunMath.J2000;
  }

  static rightAscension(l: number, b: number): Radians {
    return Math.atan2(Math.sin(l) * Math.cos(SunMath.e) - Math.tan(b) * Math.sin(SunMath.e), Math.cos(l));
  }

  static declination(l: number, b: number): Radians {
    return Math.asin(Math.sin(b) * Math.cos(SunMath.e) + Math.cos(b) * Math.sin(SunMath.e) * Math.sin(l));
  }

  static azimuth(H: number, phi: number, dec: number): Radians {
    return Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
  }

  static elevation(H: number, phi: number, dec: number): Radians {
    return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  }

  static siderealTime(d: number, lw: number): number {
    return DEG2RAD * (280.16 + 360.9856235 * d) - lw;
  }

  static astroRefraction(h: Degrees): Radians {
    if (h < 0) {
      h = 0;
    }

    return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
  }

  private static solarMeanAnomaly(d: number): number {
    return DEG2RAD * (357.5291 + 0.98560028 * d);
  }

  static eclipticLongitude(M: number): number {
    const C = DEG2RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = DEG2RAD * 102.9372; // perihelion of Earth

    return M + C + P + SunMath.PI; // Sun's mean longitude
  }

  static eclipticLatitude(B: number): number {
    const C = SunMath.TAU / 360;
    const L = B - 0.00569 - 0.00478 * Math.sin(C * B);

    return SunMath.TAU * (L + 0.0003 * Math.sin(C * 2 * L));
  }

  static getSunRaDec(d: number) {
    const M = SunMath.solarMeanAnomaly(d);
    const L = SunMath.eclipticLongitude(M);

    return {
      dec: SunMath.declination(L, 0),
      ra: SunMath.rightAscension(L, 0),
    };
  }

  static julianCyle(d: number, lw: number): number {
    return Math.round(d - SunMath.J0 - lw / ((2 * SunMath.TAU) / 2));
  }

  static approxTransit(Ht: number, lw: number, n: number): number {
    return SunMath.J0 + (Ht + lw) / (2 * PI) + n;
  }

  static solarTransitJulian(ds: number, M: number, L: number): number {
    return SunMath.J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  }

  static hourAngle(h: number, phi: number, d: number): number {
    return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)));
  }

  static getSetJulian(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): number {
    const w = SunMath.hourAngle(h, phi, dec);
    const a = SunMath.approxTransit(w, lw, n);

    return SunMath.solarTransitJulian(a, M, L);
  }
}
