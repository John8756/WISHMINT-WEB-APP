import { WpPageStructure, DEFAULT_WP_PAGES } from '../data/defaultPages';

export interface WpNavigationItem {
  id: string | number;
  label: string;
  slug: string;
  page: string;
  order: number;
  isCustom?: boolean;
}

export interface WpStatusResponse {
  connected: boolean;
  storeUrl: string;
  username: string;
  hasAppPassword: boolean;
  woocommerceConfigured: boolean;
  pageCount: number;
  lastSyncedAt?: string;
  syncMode: 'live-wordpress-rest' | 'cached-fallback';
  message?: string;
}

/**
 * Fetch all pages from WordPress REST API via our secure server route
 */
export async function getWpPages(): Promise<{
  success: boolean;
  pages: WpPageStructure[];
  source: 'wordpress-live' | 'local-cached';
  error?: string;
}> {
  try {
    const res = await fetch('/api/wp/pages', {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.pages) && data.pages.length > 0) {
        return {
          success: true,
          pages: data.pages,
          source: data.source || 'wordpress-live',
        };
      }
    }

    return {
      success: true,
      pages: DEFAULT_WP_PAGES,
      source: 'local-cached',
    };
  } catch (err: any) {
    console.warn('[wpService] Error fetching pages from WordPress proxy:', err.message);
    return {
      success: false,
      pages: DEFAULT_WP_PAGES,
      source: 'local-cached',
      error: err.message,
    };
  }
}

/**
 * Fetch a single page by slug from WordPress
 */
export async function getWpPage(slug: string): Promise<{
  success: boolean;
  page: WpPageStructure | null;
  source: 'wordpress-live' | 'local-cached';
  error?: string;
}> {
  try {
    const res = await fetch(`/api/wp/pages/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.page) {
        return {
          success: true,
          page: data.page,
          source: data.source || 'wordpress-live',
        };
      }
    }

    const fallback = DEFAULT_WP_PAGES.find((p) => p.slug === slug);
    return {
      success: Boolean(fallback),
      page: fallback || null,
      source: 'local-cached',
    };
  } catch (err: any) {
    const fallback = DEFAULT_WP_PAGES.find((p) => p.slug === slug);
    return {
      success: Boolean(fallback),
      page: fallback || null,
      source: 'local-cached',
      error: err.message,
    };
  }
}

/**
 * Sync AI Studio page structures directly into WordPress database (/wp-json/wp/v2/pages)
 */
export async function syncPagesToWordPress(pages?: WpPageStructure[]): Promise<{
  success: boolean;
  syncedCount: number;
  pages: WpPageStructure[];
  message: string;
  details?: any[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/wp/sync-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ pages: pages || DEFAULT_WP_PAGES }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('[wpService] Error syncing pages to WordPress:', err);
    return {
      success: false,
      syncedCount: 0,
      pages: pages || DEFAULT_WP_PAGES,
      message: 'Failed to communicate with sync endpoint',
      error: err.message,
    };
  }
}

/**
 * Create or update an individual page in WordPress
 */
export async function createOrUpdateWpPage(page: WpPageStructure): Promise<{
  success: boolean;
  page?: WpPageStructure;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/wp/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(page),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Delete a page from WordPress
 */
export async function deleteWpPage(id: number | string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`/api/wp/pages/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#0*38;|&amp;/gi, '&')
    .replace(/&#8217;|&#0*39;|&apos;/gi, "'")
    .replace(/&#8216;/gi, "'")
    .replace(/&#8220;|&#8221;|&quot;/gi, '"')
    .replace(/&#8211;/gi, '–')
    .replace(/&#8212;/gi, '—')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Fetch dynamic navigation menu items synced from WordPress
 */
export async function getWpNavigation(): Promise<{
  success: boolean;
  navigation: WpNavigationItem[];
}> {
  try {
    const res = await fetch('/api/wp/navigation', {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.navigation)) {
        return {
          success: true,
          navigation: data.navigation.map((item: WpNavigationItem) => ({
            ...item,
            label: decodeHtmlEntities(item.label),
          })),
        };
      }
    }
  } catch {
    // Fall through to fallback navigation
  }

  // Default navigation fallback
  return {
    success: true,
    navigation: [
      { id: 'nav-home', label: 'Home', slug: 'home', page: 'home', order: 1 },
      { id: 'nav-shop', label: 'Shop Vault', slug: 'shop', page: 'shop', order: 2 },
      { id: 'nav-handmade', label: 'Handmade Bouquets', slug: 'handmade', page: 'handmade', order: 3 },
      { id: 'nav-bts', label: 'BTS Borahae', slug: 'bts', page: 'bts', order: 4 },
      { id: 'nav-couples', label: 'Couples & Milestones', slug: 'couples', page: 'couples', order: 5 },
    ],
  };
}

/**
 * Check WordPress connectivity and authentication status
 */
export async function getWpStatus(): Promise<WpStatusResponse> {
  try {
    const res = await fetch('/api/wp/status', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn('[wpService] Status check failed:', err.message);
  }

  return {
    connected: false,
    storeUrl: 'https://whitesmoke-wolverine-491981.hostingersite.com',
    username: 'iliasmondal837',
    hasAppPassword: false,
    woocommerceConfigured: true,
    pageCount: 0,
    syncMode: 'cached-fallback',
    message: 'Backend server currently verifying credentials',
  };
}

/**
 * Configure WordPress Application Password for live REST write access
 */
export async function updateWpCredentials(creds: {
  username?: string;
  appPassword?: string;
}): Promise<{ success: boolean; message: string; status?: WpStatusResponse }> {
  try {
    const res = await fetch('/api/wp/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(creds),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to update credentials',
    };
  }
}
