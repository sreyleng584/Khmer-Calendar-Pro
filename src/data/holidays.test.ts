/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMBODIA_HOLIDAYS,
  getHolidaysForDate,
  getHolidaysForMonth,
  getHolidaysForYear,
  searchHolidays,
} from './holidays.ts';

test('Official Cambodian holiday dataset contains verified 2025 and 2026 holidays', () => {
  const holidays2026 = getHolidaysForYear(2026);
  assert.ok(holidays2026.length >= 15);

  // Check King Father Commemoration on October 15, 2026
  const oct15 = holidays2026.find((h) => h.startDate === '2026-10-15');
  assert.ok(oct15);
  assert.equal(oct15.nameKh, 'ទិវារំលឹកខួបនៃការយាងសោយព្រះទិវង្គត ព្រះបរមរតនកោដ្ឋ');
  assert.equal(oct15.verificationStatus, 'VERIFIED');
  assert.equal(oct15.isPublicHoliday, true);
  assert.ok(oct15.sourceUrl.includes('mef.gov.kh'));
});

test('Multi-day holiday spanning matches intermediate dates correctly', () => {
  // Khmer New Year 2026 is 2026-04-14 to 2026-04-16
  const day2 = getHolidaysForDate('2026-04-15');
  assert.ok(day2.length > 0);
  assert.equal(day2[0].nameKh, 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ');

  // Water Festival 2026 is 2026-11-23 to 2026-11-25
  const waterFestivalDay3 = getHolidaysForDate('2026-11-25');
  assert.ok(waterFestivalDay3.length > 0);
  assert.equal(waterFestivalDay3[0].nameKh, 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក');
});

test('Public holidays are accurately distinguished from Buddhist observances', () => {
  const meakBochea = CAMBODIA_HOLIDAYS.find((h) => h.id === 'kh-2026-02-02');
  assert.ok(meakBochea);
  assert.equal(meakBochea.category, 'BUDDHIST_OBSERVANCE');
  assert.equal(meakBochea.isPublicHoliday, false);

  const newYear = CAMBODIA_HOLIDAYS.find((h) => h.id === 'kh-2026-04-14');
  assert.ok(newYear);
  assert.equal(newYear.category, 'PUBLIC_HOLIDAY');
  assert.equal(newYear.isPublicHoliday, true);
});

test('Future unconfirmed years like 2027 are marked PROVISIONAL', () => {
  const holidays2027 = getHolidaysForYear(2027);
  assert.ok(holidays2027.length > 0);
  for (const h of holidays2027) {
    assert.equal(h.verificationStatus, 'PROVISIONAL');
  }
});

test('Search holidays works by Khmer keyword and English name', () => {
  const searchKh = searchHolidays('អុំទូក', 'ALL', 2026);
  assert.ok(searchKh.length >= 1);
  assert.ok(searchKh[0].nameKh.includes('អុំទូក'));

  const searchEn = searchHolidays('Independence', 'PUBLIC_HOLIDAY', 2026);
  assert.ok(searchEn.length >= 1);
  assert.equal(searchEn[0].startDate, '2026-11-09');
});
