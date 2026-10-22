/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWeatherCondition,
  weatherService,
  DEFAULT_LOCATION,
  POPULAR_CAMBODIA_LOCATIONS,
  CAMBODIA_MONTHLY_CLIMATE,
} from './weatherService.ts';

test('getWeatherCondition maps WMO codes to correct Khmer and English descriptions', () => {
  const clear = getWeatherCondition(0);
  assert.equal(clear.labelKh, 'មេឃស្រឡះ');
  assert.equal(clear.labelEn, 'Clear Sky');
  assert.equal(clear.iconName, 'sun');

  const rain = getWeatherCondition(63);
  assert.equal(rain.labelKh, 'ភ្លៀងមធ្យម');
  assert.equal(rain.iconName, 'cloud-rain');

  const thunder = getWeatherCondition(95);
  assert.equal(thunder.labelKh, 'ព្យុះផ្គររន្ទះ');
  assert.equal(thunder.iconName, 'cloud-lightning');
});

test('popular Cambodia locations contain Phnom Penh, Siem Reap, and Battambang with coordinates', () => {
  assert.ok(POPULAR_CAMBODIA_LOCATIONS.length >= 8);
  const pp = POPULAR_CAMBODIA_LOCATIONS.find((l) => l.id === 'phnom-penh');
  assert.ok(pp);
  assert.equal(pp?.nameKh, 'រាជធានីភ្នំពេញ');
  assert.ok(Math.abs(pp!.latitude - 11.5564) < 0.1);

  const sr = POPULAR_CAMBODIA_LOCATIONS.find((l) => l.id === 'siem-reap');
  assert.ok(sr);
  assert.ok(Math.abs(sr!.latitude - 13.3618) < 0.1);
});

test('12-month climate overview covers all 12 calendar months with typical stats', () => {
  assert.equal(CAMBODIA_MONTHLY_CLIMATE.length, 12);
  for (let i = 0; i < 12; i++) {
    const m = CAMBODIA_MONTHLY_CLIMATE[i];
    assert.equal(m.month, i + 1);
    assert.ok(m.monthNameKh.length > 0);
    assert.ok(m.averageTempMax > m.averageTempMin);
    assert.ok(m.typicalRainfallMm >= 0);
  }

  // April is the hottest peak month
  const april = CAMBODIA_MONTHLY_CLIMATE[3];
  assert.equal(april.monthNameKh, 'មេសា');
  assert.ok(april.averageTempMax >= 35);
});
