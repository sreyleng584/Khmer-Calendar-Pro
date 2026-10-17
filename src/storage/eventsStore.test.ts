/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { eventsStore } from './eventsStore.ts';

test('eventsStore seeds and retrieves initial events', () => {
  eventsStore.resetToSeed();
  const all = eventsStore.getAll();
  assert.ok(all.length >= 3);
  assert.ok(all.some((e) => e.title.includes('វត្តអារាម')));
});

test('eventsStore can save a new event and retrieve it by date', () => {
  const newEv = eventsStore.save({
    title: 'ចូលរួមពិធីមង្គលការមិត្តភក្តិ',
    date: '2026-11-15',
    time: '17:00',
    description: 'សណ្ឋាគារហ្គាដិនស៊ីធី ភ្នំពេញ',
    category: 'family',
    reminder: '1d_before',
  });

  assert.ok(newEv.id);
  assert.equal(newEv.title, 'ចូលរួមពិធីមង្គលការមិត្តភក្តិ');

  const onDate = eventsStore.getByDate('2026-11-15');
  assert.equal(onDate.length, 1);
  assert.equal(onDate[0].id, newEv.id);

  // Clean up
  eventsStore.delete(newEv.id);
  assert.equal(eventsStore.getByDate('2026-11-15').length, 0);
});

test('eventsStore safely exports and imports valid JSON data', () => {
  const exportStr = eventsStore.exportJson();
  assert.ok(exportStr.includes('version'));
  assert.ok(exportStr.includes('events'));

  const sampleImport = JSON.stringify({
    version: '1.0',
    events: [
      {
        id: 'test-import-1',
        title: 'កិច្ចប្រជុំពិសេស',
        date: '2026-12-01',
        time: '10:00',
        category: 'work',
        reminder: '15m_before',
      },
    ],
  });

  const res = eventsStore.importJson(sampleImport);
  assert.equal(res.success, true);
  assert.equal(res.count, 1);

  const imported = eventsStore.getByDate('2026-12-01');
  assert.equal(imported.length, 1);
  assert.equal(imported[0].title, 'កិច្ចប្រជុំពិសេស');

  // Clean up
  eventsStore.delete('test-import-1');
});
