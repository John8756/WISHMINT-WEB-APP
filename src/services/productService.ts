import { Product } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

export interface ProductsApiResponse {
  success: boolean;
  source: string;
  count: number;
  products: Product[];
  error?: string;
  message?: string;
}

/**
 * Fetch products from the secure local server-side API endpoint (/api/products).
 * Optionally filters by category (slug or ID).
 * No WooCommerce credentials or secrets are ever exposed to the client browser.
 */
export async function getProductsFromApi(categoryIdentifier?: string): Promise<{
  products: Product[];
  isLiveWooCommerce: boolean;
  error?: string;
}> {
  try {
    const url =
      categoryIdentifier && categoryIdentifier !== 'all'
        ? `/api/products?category=${encodeURIComponent(categoryIdentifier)}`
        : '/api/products';

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      console.warn('[ProductService] Backend proxy returned error status:', res.status, errorJson);
      return {
        products: FALLBACK_PRODUCTS,
        isLiveWooCommerce: false,
        error: errorJson.message || `Server returned ${res.status}`,
      };
    }

    const data: ProductsApiResponse = await res.json();

    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      // In production, use real WooCommerce products directly as the authoritative product source
      return {
        products: data.products,
        isLiveWooCommerce: true,
      };
    }

    return {
      products: FALLBACK_PRODUCTS,
      isLiveWooCommerce: false,
    };
  } catch (err: any) {
    console.error('[ProductService] Network error fetching from local API route:', err);
    return {
      products: FALLBACK_PRODUCTS,
      isLiveWooCommerce: false,
      error: err.message,
    };
  }
}

/**
 * Fetch a specific product by slug or ID from the secure server endpoint (/api/products/:identifier)
 */
export async function getProductBySlugOrId(identifier: string): Promise<{
  product: Product | null;
  isLiveWooCommerce: boolean;
  error?: string;
}> {
  if (!identifier) {
    return { product: null, isLiveWooCommerce: false, error: 'Missing product identifier' };
  }

  try {
    const res = await fetch(`/api/products/${encodeURIComponent(identifier)}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.product) {
        return {
          product: data.product,
          isLiveWooCommerce: data.source === 'woocommerce-secure-backend',
        };
      }
    }

    // If server returned 404 or non-OK, search static catalog
    const local = FALLBACK_PRODUCTS.find(
      (p) => p.slug === identifier || p.id === identifier
    );
    if (local) {
      return { product: local, isLiveWooCommerce: false };
    }

    return { product: null, isLiveWooCommerce: false, error: 'Product not found' };
  } catch (err: any) {
    console.error(`[ProductService] Error fetching product "${identifier}":`, err);
    const local = FALLBACK_PRODUCTS.find(
      (p) => p.slug === identifier || p.id === identifier
    );
    return {
      product: local || null,
      isLiveWooCommerce: false,
      error: err.message,
    };
  }
}

/**
 * Trigger secure server-side export of mock products to WooCommerce.
 * Credentials are kept 100% secure on the server side.
 */
export async function exportMockProductsToWooCommerce(): Promise<{
  success: boolean;
  message: string;
  count?: number;
  details?: any[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/export-products-to-wc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to communicate with WooCommerce migration server',
      error: err.message,
    };
  }
}

/**
 * Retrieve current WooCommerce connection and product table status from secure backend
 */
export async function getWooCommerceAdminStatus(): Promise<{
  connected: boolean;
  storeUrl: string;
  productCount: number;
  products?: { id: number; name: string; slug: string; price: string; status: string; imagesCount: number }[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/wc-status', {
      headers: { Accept: 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    return {
      connected: false,
      storeUrl: 'https://whitesmoke-wolverine-491981.hostingersite.com',
      productCount: 0,
      error: err.message,
    };
  }
}


