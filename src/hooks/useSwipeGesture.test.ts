/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { detectSwipeDirection } from './useSwipeGesture.ts';

test('detectSwipeDirection correctly detects horizontal left swipe', () => {
  // Swipe left: start at 250, end at 150 (deltaX = -100) with minimal vertical change
  const res = detectSwipeDirection(250, 100, 150, 110);
  assert.equal(res, 'left');
});

test('detectSwipeDirection correctly detects horizontal right swipe', () => {
  // Swipe right: start at 100, end at 200 (deltaX = +100) with minimal vertical change
  const res = detectSwipeDirection(100, 100, 200, 105);
  assert.equal(res, 'right');
});

test('detectSwipeDirection ignores short taps below minimum threshold', () => {
  // Movement of only 15px (tap / slight jitter)
  const res = detectSwipeDirection(150, 200, 165, 202);
  assert.equal(res, null);

  // Exact 0 delta (still tap on date cell)
  const tapRes = detectSwipeDirection(100, 100, 100, 100);
  assert.equal(tapRes, null);

  // 44px movement (just under default 45px threshold)
  const justUnderRes = detectSwipeDirection(100, 100, 144, 100);
  assert.equal(justUnderRes, null);

  // Exactly 45px movement (meets threshold)
  const meetsRes = detectSwipeDirection(100, 100, 145, 100);
  assert.equal(meetsRes, 'right');
});

test('detectSwipeDirection rejects vertical scrolling gestures', () => {
  // User scrolling down the page: deltaY = 180, deltaX = 40
  const res = detectSwipeDirection(200, 100, 240, 280);
  assert.equal(res, null);

  // User scrolling up the page: deltaY = -150, deltaX = -50
  const upRes = detectSwipeDirection(200, 300, 150, 150);
  assert.equal(upRes, null);

  // Diagonal 45-degree swipe (deltaX = 80, deltaY = 70 -> deltaY > deltaX * 0.75)
  const diagonal = detectSwipeDirection(100, 100, 180, 170);
  assert.equal(diagonal, null);
});

test('detectSwipeDirection honors custom options for threshold and ratio', () => {
  // With custom minThreshold of 80px:
  const belowThreshold = detectSwipeDirection(100, 100, 160, 100, { minThreshold: 80 });
  assert.equal(belowThreshold, null);

  const aboveThreshold = detectSwipeDirection(100, 100, 190, 100, { minThreshold: 80 });
  assert.equal(aboveThreshold, 'right');

  // With strict vertical tolerance (e.g. 0.3)
  const strictRatio = detectSwipeDirection(100, 100, 180, 130, { verticalToleranceRatio: 0.3 });
  assert.equal(strictRatio, null);
});
