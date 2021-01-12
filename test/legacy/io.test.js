/**
 * @file   Tests from Sgp4JsUtils.js to ensure compatibility
 * @since  0.2.0
 */

import badTleData from './io.json';
import { Sgp4Js } from '../../src/sgp4.js'; // eslint-disable-line

describe('Twoline', () => {
  it('twoline to satellite record', () => {
    badTleData.forEach((tleDataItem) => {
      const satrec = Sgp4Js.twoline2rv(tleDataItem.tleLine1, tleDataItem.tleLine2);
      tleDataItem.results.forEach((expected) => {
        // Fetching satellite record from incorrectly formatted TLE lines
        expect(satrec.error).toEqual(expected.error);
      });
    });
  });
});
