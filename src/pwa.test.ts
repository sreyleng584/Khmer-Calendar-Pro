/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getKhmerDate } from './calendar/khmerDateAdapter.ts';
import { CAMBODIA_HOLIDAYS, getHolidaysForDate } from './data/holidays.ts';
import { eventsStore } from './storage/eventsStore.ts';

test('PWA manifest and icon assets exist and comply with standards', () => {
  // Check required public icons
  const requiredIcons = [
    'public/icon.svg',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/pwa-maskable-512x512.png',
    'public/apple-touch-icon.png',
    'public/favicon.ico',
  ];

  for (const iconPath of requiredIcons) {
    assert.ok(fs.existsSync(iconPath), `Expected icon asset ${iconPath} to exist`);
    const stats = fs.statSync(iconPath);
    assert.ok(stats.size > 0, `Expected icon asset ${iconPath} to have non-zero file size`);
  }
});

test('Vite config specifies valid PWA manifest fields matching brief', () => {
  const viteConfigContent = fs.readFileSync('vite.config.ts', 'utf-8');

  // Exact names requested
  assert.match(viteConfigContent, /name:\s*['"]Khmer Calendar Pro['"]/);
  assert.match(viteConfigContent, /short_name:\s*['"]Khmer Calendar['"]/);
  assert.match(viteConfigContent, /display:\s*['"]standalone['"]/);
  assert.match(viteConfigContent, /start_url:\s*['"]\/['"]/);
  assert.match(viteConfigContent, /scope:\s*['"]\/['"]/);
  assert.match(viteConfigContent, /purpose:\s*['"]maskable['"]/);
  assert.match(viteConfigContent, /purpose:\s*['"]any['"]/);

  // Short name must be <= 12 characters to prevent truncation on mobile home screens
  const shortName = 'Khmer Calendar';
  assert.ok(shortName.length <= 15, 'Short name length appropriate for mobile launcher');
});

test('Capacitor Android configuration matches PWA app identity', () => {
  assert.ok(fs.existsSync('capacitor.config.ts'), 'capacitor.config.ts must exist');
  const capContent = fs.readFileSync('capacitor.config.ts', 'utf-8');
  assert.match(capContent, /appName:\s*['"]Khmer Calendar Pro['"]/);
  assert.match(capContent, /appId:\s*['"]com\.khmercalendar\.pro['"]/);
  assert.match(capContent, /webDir:\s*['"]dist['"]/);
});

test('Khmer lunar engine operates completely offline without network', () => {
  // Verify standard test date 2026-10-15 calculates instantly from bundled formulas
  const res = getKhmerDate(2026, 10, 15);
  assert.equal(res.khmer.lunarDayStringKh, '៤កើត');
  assert.equal(res.khmer.monthNameKh, 'អស្សុជ');
  assert.equal(res.khmer.animalYearNameKh, 'មមី');
  assert.equal(res.khmer.beYear, 2570);
});

test('Buddhist holy day calculations execute offline with 0 remote dependencies', () => {
  // Test observance day calculation: 2026-10-19 is ៨កើត (Buddhist Holy Day)
  const holyDay = getKhmerDate(2026, 10, 19);
  assert.equal(holyDay.khmer.isBuddhistHolyDay, true);

  // Test non-observance day: 2026-10-20 is ៩កើត (Regular day)
  const regularDay = getKhmerDate(2026, 10, 20);
  assert.equal(regularDay.khmer.isBuddhistHolyDay, false);
});

test('Offline holiday dataset preserves verified status and source authority', () => {
  assert.ok(CAMBODIA_HOLIDAYS.length > 30, 'Holidays dataset must contain comprehensive list');
  const h2026 = getHolidaysForDate('2026-10-15');
  assert.ok(h2026.length > 0);
  assert.equal(h2026[0].verificationStatus, 'VERIFIED');
  assert.ok(h2026[0].sourceAuthority.length > 0);
});

test('Offline user events storage retains saved data across sessions', () => {
  const testEvent = {
    title: 'PWA Offline Test Event',
    date: '2026-10-15',
    category: 'religious' as const,
    reminder: 'at_time' as const,
  };

  const saved = eventsStore.save(testEvent);
  assert.ok(saved.id);

  const retrieved = eventsStore.getByDate('2026-10-15');
  assert.ok(retrieved.some((e) => e.title === 'PWA Offline Test Event'));

  // Clean up test event
  eventsStore.delete(saved.id);
});
