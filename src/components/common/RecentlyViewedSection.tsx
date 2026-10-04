import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { getRecentlyViewed, clearRecentlyViewed } from '../../services/recentlyViewedService';
import { AnimatedAddToCartButton } from './AnimatedAddToCartButton';
import { Clock, Trash2, ArrowRight } from 'lucide-react';

interface RecentlyViewedSectionProps {
  currentProductId?: string;
  isMobile?: boolean;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentProductId,
  isMobile = false,
}) => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, showToast } = useShop();
  const [recentItems, setRecentItems] = useState<Product[]>([]);

  const loadItems = () => {
    const all = getRecentlyViewed();
    // Exclude the currently viewed product so users see other previously browsed items
    const filtered = all.filter(
      (item) => item.id !== currentProductId && item.slug !== currentProductId
    );
    setRecentItems(filtered);
  };

  useEffect(() => {
    loadItems();

    // Listen for storage events (e.g. cross-tab or updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wishmint_recently_viewed_v1') {
        loadItems();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentProductId]);

  const handleClear = () => {
    clearRecentlyViewed();
    setRecentItems([]);
    showToast('Browsing history cleared');
  };

  if (recentItems.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <section className="mt-8 mb-6 pt-6 border-t border-[#EADBCE]/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#9A7036] text-[10px] font-bold uppercase tracking-wider mb-0.5">
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>Browsing History</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#4A234A]">
              Recently Viewed
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-medium text-[#867277] hover:text-[#ba1a1a] flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear history"
          >
            <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
            <span>Clear</span>
          </button>
        </div>

        {/* Horizontal scroll on mobile */}
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-2 -mx-gutter px-gutter">
          {recentItems.map((p) => {
            const wishlisted = isWishlisted(p.id);
            const displayPrice = Math.round(p.price < 150 ? p.price * 82 : p.price);
            const originalPrice = p.originalPrice
              ? Math.round(p.originalPrice < 150 ? p.originalPrice * 82 : p.originalPrice)
              : undefined;

            return (
              <div
                key={p.id}
                className="flex-shrink-0 w-44 rounded-xl bg-white/95 border border-[#EADBCE] shadow-xs p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-[#FAF7F2]/60">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() => navigateTo('product-details', p.slug)}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[#814f65] shadow-xs active:scale-90 transition-transform cursor-pointer"
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ba1a1a' } : {}}
                      >
                        {wishlisted ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#9A7036] block truncate mb-0.5">
                    {p.categoryLabel || 'Keepsake'}
                  </span>
                  <h4
                    onClick={() => navigateTo('product-details', p.slug)}
                    className="font-serif text-xs font-bold text-[#4A234A] line-clamp-1 cursor-pointer hover:underline mb-1"
                    title={p.name}
                  >
                    {p.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-[#EADBCE]/50 mt-1">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className="font-bold tabular-nums tracking-tight text-[#4A234A]"
                      style={{ fontSize: '1.25rem', color: '#4A234A' }}
                    >
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                    {originalPrice && (
                      <span className="text-[10px] text-[#867277]/70 line-through tabular-nums">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigateTo('product-details', p.slug)}
                      className="flex-1 py-1 rounded-full bg-[#FFF9F5] border border-[#C9A46C]/60 text-[#4A234A] text-[10px] font-semibold text-center cursor-pointer hover:border-[#C9A46C]"
                    >
                      Inspect
                    </button>
                    <AnimatedAddToCartButton
                      onAdd={() => {
                        addToCart(p, 1);
                        showToast(`Added ${p.name} to Bag! 💐`);
                      }}
                      label="Claim"
                      className="flex-1 py-1"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Desktop Layout
  return (
    <section className="mt-16 pt-12 border-t border-brand-plum/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-brand-rosegold text-xs font-bold uppercase tracking-widest mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Browsing History</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-brand-dark font-light">
            Recently Viewed Keepsakes
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-brand-gray hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear browsing history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-brand-plum hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentItems.slice(0, 4).map((p) => {
          const wishlisted = isWishlisted(p.id);
          const displayPrice = p.source === 'woocommerce'
            ? Math.round(p.price)
            : Math.round(p.price < 150 ? p.price * 82 : p.price);
          const originalPrice = p.originalPrice
            ? p.source === 'woocommerce'
              ? Math.round(p.originalPrice)
              : Math.round(p.originalPrice < 150 ? p.originalPrice * 82 : p.originalPrice)
            : undefined;

          return (
            <div
              key={p.id}
              className="group rounded-2xl bg-white border border-[#EADBCE]/80 hover:border-[#C9A46C] p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md"
            >
              <div>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#FAF7F2]/60">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    onClick={() => navigateTo('product-details', p.slug)}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-all cursor-pointer ${
                      wishlisted ? 'text-red-500' : 'text-[#814f65] hover:text-red-500'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ba1a1a' } : {}}
                    >
                      {wishlisted ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9A7036] block truncate mb-1">
                  {p.categoryLabel || 'Handmade Keepsake'}
                </span>
                <h4
                  onClick={() => navigateTo('product-details', p.slug)}
                  className="font-serif text-base font-bold text-[#4A234A] line-clamp-1 cursor-pointer hover:underline mb-1"
                  title={p.name}
                >
                  {p.name}
                </h4>
                <p className="text-xs text-[#534247] line-clamp-1 mb-3">
                  {p.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EADBCE]/60 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-bold tabular-nums tracking-tight text-[#4A234A]"
                    style={{ fontSize: '1.25rem', color: '#4A234A' }}
                  >
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  {originalPrice && (
                    <span className="text-xs text-[#867277]/70 line-through tabular-nums">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('product-details', p.slug)}
                    className="px-3 py-1.5 rounded-full bg-[#FFF9F5] border border-[#C9A46C]/60 text-[#4A234A] text-xs font-semibold hover:border-[#C9A46C] cursor-pointer"
                  >
                    Inspect
                  </button>
                  <AnimatedAddToCartButton
                    onAdd={() => {
                      addToCart(p, 1);
                      showToast(`Added ${p.name} to Bag! 💐`);
                    }}
                    label="Claim"
                    className="px-3.5 py-1.5"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
