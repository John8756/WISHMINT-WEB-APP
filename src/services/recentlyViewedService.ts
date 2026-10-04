import { Product } from '../types';

const STORAGE_KEY = 'wishmint_recently_viewed_v1';
const MAX_RECENTLY_VIEWED = 12;

/**
 * Retrieve the list of recently viewed products from localStorage.
 */
export function getRecentlyViewed(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[RecentlyViewed] Error reading from localStorage:', err);
    return [];
  }
}

/**
 * Add a product to the recently viewed list in localStorage.
 * Deduplicates and places the latest viewed product at index 0.
 */
export function addRecentlyViewed(product: Product): Product[] {
  if (typeof window === 'undefined' || !product || !product.id) return [];
  try {
    const existing = getRecentlyViewed();
    // Filter out if already in history so it moves to top
    const filtered = existing.filter(
      (p) => p.id !== product.id && p.slug !== product.slug
    );
    const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[RecentlyViewed] Error saving to localStorage:', err);
    return [];
  }
}

/**
 * Clear recently viewed history from localStorage.
 */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[RecentlyViewed] Error clearing localStorage:', err);
  }
}
