/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getKhmerDate,
  toKhmerNumerals,
  fromKhmerNumerals,
  checkIsBuddhistHolyDay,
  getKhmerNewYearDetail,
  getDaysInMonth,
  getFirstWeekdayOfMonth,
  MoonPhase,
  getCambodiaToday,
  getNextMonth,
  getPrevMonth,
} from './khmerDateAdapter.ts';

test('Khmer numerals conversion works accurately in both directions', () => {
  assert.equal(toKhmerNumerals(2026), '២០២៦');
  assert.equal(toKhmerNumerals('15'), '១៥');
  assert.equal(toKhmerNumerals('0123456789'), '០១២៣៤៥៦៧៨៩');

  assert.equal(fromKhmerNumerals('២០២៦'), '2026');
  assert.equal(fromKhmerNumerals('១៥'), '15');
});

test('Gregorian date 2026-10-15 converts to verified Khmer lunar date', () => {
  const result = getKhmerDate(2026, 10, 15);
  assert.equal(result.isVerified, true);
  assert.equal(result.gregorian.year, 2026);
  assert.equal(result.gregorian.month, 10);
  assert.equal(result.gregorian.day, 15);
  assert.equal(result.gregorian.dayOfWeek, 4); // Thursday
  assert.equal(result.gregorian.dayOfWeekNameKh, 'ថ្ងៃព្រហស្បតិ៍');

  assert.equal(result.khmer.day, 4);
  assert.equal(result.khmer.moonPhaseNameKh, 'កើត');
  assert.equal(result.khmer.lunarDayStringKh, '៤កើត');
  assert.equal(result.khmer.monthNameKh, 'អស្សុជ');
  assert.equal(result.khmer.beYear, 2570);
  assert.equal(result.khmer.animalYearNameKh, 'មមី'); // Horse
  assert.equal(result.khmer.sakNameKh, 'អដ្ឋស័ក'); // 8th Sak
});

test('Buddhist Holy Day (ថ្ងៃសីល) detection works for 8th and 15th waxing and waning', () => {
  // 8th waxing
  const holyDay8Wax = checkIsBuddhistHolyDay(8, MoonPhase.Waxing, 0);
  assert.equal(holyDay8Wax.isHolyDay, true);
  assert.equal(holyDay8Wax.type, '8_waxing');

  // 15th waxing (Full moon)
  const holyDay15Wax = checkIsBuddhistHolyDay(15, MoonPhase.Waxing, 0);
  assert.equal(holyDay15Wax.isHolyDay, true);
  assert.equal(holyDay15Wax.type, '15_waxing');

  // 8th waning
  const holyDay8Wan = checkIsBuddhistHolyDay(8, MoonPhase.Waning, 0);
  assert.equal(holyDay8Wan.isHolyDay, true);
  assert.equal(holyDay8Wan.type, '8_waning');

  // 15th waning (New moon)
  const holyDay15Wan = checkIsBuddhistHolyDay(15, MoonPhase.Waning, 0);
  assert.equal(holyDay15Wan.isHolyDay, true);
  assert.equal(holyDay15Wan.type, '15_waning');

  // Ordinary day (5th waxing)
  const normalDay = checkIsBuddhistHolyDay(5, MoonPhase.Waxing, 0);
  assert.equal(normalDay.isHolyDay, false);
});

test('Leap month handling in 2023 and 2026 contains Pathamasadh and Tutiyasadh', () => {
  // Test that year 2023 contains Pathamasadh (បឋមាសាឍ) and Tutiyasadh (ទុតិយាសាឍ)
  const months2023 = new Set<string>();
  for (let m = 6; m <= 8; m++) {
    for (let d = 1; d <= 28; d += 7) {
      const kd = getKhmerDate(2023, m, d);
      months2023.add(kd.khmer.monthNameKh);
    }
  }
  assert.ok(months2023.has('បឋមាសាឍ') || months2023.has('ទុតិយាសាឍ'));

  // Test that year 2026 also contains leap month
  const months2026 = new Set<string>();
  for (let m = 6; m <= 8; m++) {
    for (let d = 1; d <= 28; d += 7) {
      const kd = getKhmerDate(2026, m, d);
      months2026.add(kd.khmer.monthNameKh);
    }
  }
  assert.ok(months2026.has('បឋមាសាឍ') || months2026.has('ទុតិយាសាឍ'));
});

test('Khmer New Year calculation returns correct Sangkran date and time', () => {
  const ny2024 = getKhmerNewYearDetail(2024);
  assert.equal(ny2024.year, 2024);
  assert.equal(ny2024.sangkranDate, '2024-04-13');
  assert.equal(ny2024.sangkranTime, '22:17');
  assert.equal(ny2024.animalYearKh, 'រោង'); // Dragon
  assert.equal(ny2024.totalDays, 4);
  assert.equal(ny2024.dayNamesKh.length, 4);

  const ny2026 = getKhmerNewYearDetail(2026);
  assert.equal(ny2026.year, 2026);
  assert.equal(ny2026.sangkranDate, '2026-04-14');
  assert.equal(ny2026.sangkranTime, '10:48');
  assert.equal(ny2026.animalYearKh, 'មមី'); // Horse
  assert.equal(ny2026.totalDays, 3);
  assert.equal(ny2026.dayNamesKh.length, 3);
});

test('getCambodiaToday returns valid local Cambodia date', () => {
  const today = getCambodiaToday();
  assert.ok(today.year >= 2025 && today.year <= 2030);
  assert.ok(today.month >= 1 && today.month <= 12);
  assert.ok(today.day >= 1 && today.day <= 31);
  assert.match(today.dateString, /^\d{4}-\d{2}-\d{2}$/);
});

test('Buddhist Holy Day accurately distinguishes 29-day vs 30-day lunar month endings', () => {
  // January 2026: Boss is a 30-day month.
  // 2026-01-17 was 14រោច (not end of month yet)
  const d17 = getKhmerDate(2026, 1, 17);
  assert.equal(d17.khmer.isBuddhistHolyDay, false);

  // 2026-01-18 was 15រោច (genuine end of month / ដាច់ខែ)
  const d18 = getKhmerDate(2026, 1, 18);
  assert.equal(d18.khmer.isBuddhistHolyDay, true);

  // February 2026: Meak is a 29-day month.
  // 2026-02-16 was 14រោច (genuine end of month / ដាច់ខែ)
  const febEnd = getKhmerDate(2026, 2, 16);
  assert.equal(febEnd.khmer.isBuddhistHolyDay, true);
});

test('Gregorian calendar math functions return correct day count and alignment', () => {
  // February in leap year 2024 vs non-leap year 2025
  assert.equal(getDaysInMonth(2024, 2), 29);
  assert.equal(getDaysInMonth(2025, 2), 28);
  assert.equal(getDaysInMonth(2026, 10), 31);

  // 2026-10-01 was a Thursday (index 4)
  assert.equal(getFirstWeekdayOfMonth(2026, 10), 4);
});

test('Month navigation handles December to January and January to December transitions', () => {
  // December 2026 -> January 2027
  const nextFromDec = getNextMonth(2026, 12);
  assert.equal(nextFromDec.year, 2027);
  assert.equal(nextFromDec.month, 1);

  // Normal month advance: April -> May
  const nextFromApr = getNextMonth(2026, 4);
  assert.equal(nextFromApr.year, 2026);
  assert.equal(nextFromApr.month, 5);

  // January 2026 -> December 2025
  const prevFromJan = getPrevMonth(2026, 1);
  assert.equal(prevFromJan.year, 2025);
  assert.equal(prevFromJan.month, 12);

  // Normal month regress: October -> September
  const prevFromOct = getPrevMonth(2026, 10);
  assert.equal(prevFromOct.year, 2026);
  assert.equal(prevFromOct.month, 9);
});

test('Buddhist Holy Day (ថ្ងៃសីល) observance flag is true on verified dates and false on ordinary dates', () => {
  // Verified Buddhist observance dates:
  const holyDay1 = getKhmerDate(2026, 10, 19); // ៨កើត ខែអស្សុជ
  assert.equal(holyDay1.khmer.isBuddhistHolyDay, true);

  const holyDay2 = getKhmerDate(2026, 10, 26); // ១៥កើត ខែអស្សុជ (Full Moon)
  assert.equal(holyDay2.khmer.isBuddhistHolyDay, true);

  const holyDay3 = getKhmerDate(2026, 11, 3); // ៨រោច ខែអស្សុជ
  assert.equal(holyDay3.khmer.isBuddhistHolyDay, true);

  const holyDay4 = getKhmerDate(2026, 11, 9); // ១៤រោច ខែអស្សុជ (ដាច់ខែ)
  assert.equal(holyDay4.khmer.isBuddhistHolyDay, true);

  // Ordinary dates must NOT have the holy day observance flag:
  const normalDay1 = getKhmerDate(2026, 10, 15); // ៤កើត ខែអស្សុជ
  assert.equal(normalDay1.khmer.isBuddhistHolyDay, false);

  const normalDay2 = getKhmerDate(2026, 10, 20); // ៩កើត ខែអស្សុជ
  assert.equal(normalDay2.khmer.isBuddhistHolyDay, false);

  const normalDay3 = getKhmerDate(2026, 10, 25); // ១៤កើត ខែអស្សុជ
  assert.equal(normalDay3.khmer.isBuddhistHolyDay, false);
});

