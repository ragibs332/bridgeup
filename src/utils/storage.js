/**
 * Quota-Safe Local Storage Wrapper
 * Prevents DOMException: QuotaExceededError from crashing React components.
 */

export function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`safeGetItem failed for ${key}:`, err);
    return defaultValue;
  }
}

export function safeSetItem(key, value) {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`safeSetItem Quota or Storage Error for key: ${key}`, err);
    try {
      // If quota exceeded, clean up non-essential cached logs / large values
      if (Array.isArray(value) && value.length > 20) {
        // Keep latest 20 items only
        const trimmed = value.slice(0, 20);
        localStorage.setItem(key, JSON.stringify(trimmed));
        return true;
      }
    } catch (innerErr) {
      console.error(`Failed to store fallback for key: ${key}`, innerErr);
    }
    return false;
  }
}

export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`safeRemoveItem failed for ${key}:`, err);
  }
}
