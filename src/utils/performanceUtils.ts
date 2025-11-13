import { InteractionManager } from 'react-native';

/**
 * Performance utilities for optimizing React Native app
 */

/**
 * Run a task after all interactions are complete
 * Useful for deferring non-critical work until after animations
 */
export const runAfterInteractions = (task: () => void): void => {
  InteractionManager.runAfterInteractions(() => {
    task();
  });
};

/**
 * Debounce function to limit how often a function can be called
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function to ensure a function is called at most once per interval
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Measure component render time (development only)
 */
export const measureRenderTime = (
  componentName: string,
  callback: () => void
): void => {
  if (__DEV__) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > 16) {
      // More than one frame (60fps = 16.67ms per frame)
      console.warn(
        `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`
      );
    }
  } else {
    callback();
  }
};

/**
 * Batch multiple state updates together
 */
export const batchUpdates = (updates: Array<() => void>): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

/**
 * Check if device is low-end based on available memory
 * Returns true if device should use performance optimizations
 */
export const isLowEndDevice = (): boolean => {
  // This is a simplified check
  // In production, you might want to use a library like react-native-device-info
  return false; // Default to false for now
};

/**
 * Optimize image dimensions for display
 */
export const getOptimizedImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

/**
 * Create a memoization cache for expensive computations
 */
export const createMemoCache = <T extends (...args: any[]) => any>(
  fn: T,
  maxSize: number = 10
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    // Limit cache size
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as T;
};
