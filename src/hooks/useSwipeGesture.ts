/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useCallback } from 'react';

export type SwipeDirection = 'left' | 'right' | null;

export interface SwipeOptions {
  minThreshold?: number; // Minimum horizontal distance in px (default 45)
  verticalToleranceRatio?: number; // Maximum ratio of vertical to horizontal movement (default 0.75)
}

/**
 * Pure function to detect horizontal swipe direction from start and end coordinates.
 * Returns 'left', 'right', or null (if movement was too small or predominantly vertical).
 */
export function detectSwipeDirection(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  options?: SwipeOptions
): SwipeDirection {
  const minThreshold = options?.minThreshold ?? 45;
  const verticalToleranceRatio = options?.verticalToleranceRatio ?? 0.75;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  // Must exceed the minimum horizontal distance
  if (absX < minThreshold) {
    return null;
  }

  // If vertical movement is too prominent, treat as normal page scrolling, not a horizontal swipe
  if (absY > absX * verticalToleranceRatio) {
    return null;
  }

  // Left swipe (finger moved left -> advance to next month)
  if (deltaX < 0) {
    return 'left';
  }

  // Right swipe (finger moved right -> go back to previous month)
  return 'right';
}

interface UseSwipeGestureProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  options?: SwipeOptions;
}

/**
 * React hook providing both pointer and touch gesture handlers for horizontal swipe navigation.
 * Compatible with mobile browsers, iOS Safari, Android touchscreens, and mouse drag.
 * Guaranteed to prevent duplicate month changes when both pointer and touch events occur.
 */
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  options,
}: UseSwipeGestureProps) {
  const startCoordRef = useRef<{ x: number; y: number } | null>(null);
  const currentCoordRef = useRef<{ x: number; y: number } | null>(null);
  const lastSwipeTimeRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);

  const processGestureEnd = useCallback(() => {
    if (!startCoordRef.current || !currentCoordRef.current) {
      startCoordRef.current = null;
      currentCoordRef.current = null;
      isPointerDownRef.current = false;
      return;
    }

    const startX = startCoordRef.current.x;
    const startY = startCoordRef.current.y;
    const endX = currentCoordRef.current.x;
    const endY = currentCoordRef.current.y;

    startCoordRef.current = null;
    currentCoordRef.current = null;
    isPointerDownRef.current = false;

    const now = Date.now();
    // Enforce 450ms cooldown to strictly prevent duplicate month changes from dual pointer+touch events
    if (now - lastSwipeTimeRef.current < 450) {
      return;
    }

    const direction = detectSwipeDirection(startX, startY, endX, endY, options);

    if (direction === 'left') {
      lastSwipeTimeRef.current = now;
      onSwipeLeft();
    } else if (direction === 'right') {
      lastSwipeTimeRef.current = now;
      onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight, options]);

  // Touch Event Handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startCoordRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      currentCoordRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && startCoordRef.current) {
      currentCoordRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    processGestureEnd();
  }, [processGestureEnd]);

  const onTouchCancel = useCallback(() => {
    startCoordRef.current = null;
    currentCoordRef.current = null;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore secondary mouse buttons (e.g. right-click, middle-click)
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }
    isPointerDownRef.current = true;
    startCoordRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    currentCoordRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (isPointerDownRef.current && startCoordRef.current) {
      currentCoordRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (isPointerDownRef.current) {
      currentCoordRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      processGestureEnd();
    }
  }, [processGestureEnd]);

  const onPointerCancel = useCallback(() => {
    startCoordRef.current = null;
    currentCoordRef.current = null;
    isPointerDownRef.current = false;
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}
