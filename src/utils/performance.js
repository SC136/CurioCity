import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Memoize components to prevent unnecessary re-renders
export const memoComponent = (Component) => React.memo(Component);

// Optimize list item rendering
export const optimizeListItem = (item, index, visibleRange = 5) => {
  // Only render items near the viewport
  return index >= visibleRange.start && index <= visibleRange.end;
};

// Debounce function for search and API calls
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image optimization - get appropriate image size
export const getOptimizedImageUrl = (url, width, quality = 85) => {
  if (!url) return null;
  // For real implementations, add image service like Cloudinary
  // Example: `${url}?w=${width}&q=${quality}`
  return url;
};

// API request with timeout and retry
export const fetchWithTimeout = async (url, options = {}, retries = 2) => {
  const timeout = options.timeout || 8000;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok && attempt < retries) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

// Batch API requests
export const batchRequests = async (requests, maxConcurrent = 3) => {
  const results = [];
  for (let i = 0; i < requests.length; i += maxConcurrent) {
    const batch = requests.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  return results;
};

// Cache management
class CacheManager {
  constructor(maxAge = 300000) { // 5 minutes default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    return this.get(key) !== null;
  }
}

export const cacheManager = new CacheManager();

// Optimize async operations
export const withLoadingState = (asyncFunc) => {
  return async (...args) => {
    try {
      return {
        loading: false,
        data: await asyncFunc(...args),
        error: null,
      };
    } catch (error) {
      return {
        loading: false,
        data: null,
        error: error.message,
      };
    }
  };
};

// Performance monitoring
export const measurePerformance = async (name, fn) => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance Error] ${name}: ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

export default {
  memoComponent,
  optimizeListItem,
  debounce,
  throttle,
  getOptimizedImageUrl,
  fetchWithTimeout,
  batchRequests,
  cacheManager,
  withLoadingState,
  measurePerformance,
};
