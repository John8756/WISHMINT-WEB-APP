export interface WcCategory {
  id: number | string;
  name: string;
  slug: string;
  count: number;
  description?: string;
  image?: string | null;
}

export async function getCategoriesFromApi(): Promise<{
  success: boolean;
  categories: WcCategory[];
  source: string;
}> {
  try {
    const res = await fetch('/api/categories', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        return {
          success: true,
          categories: data.categories,
          source: data.source || 'woocommerce-live',
        };
      }
    }
  } catch (err: any) {
    console.warn('[CategoryService] Error fetching categories:', err.message);
  }

  return {
    success: false,
    categories: [],
    source: 'fallback',
  };
}
