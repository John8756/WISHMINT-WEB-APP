import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { AnimatedAddToCartButton } from '../common/AnimatedAddToCartButton';

export const MobileSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    navigateTo,
    addToCart,
    showToast,
    setSearchQuery,
    products,
  } = useShop();

  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleClose = () => {
    setIsSearchOpen(false);
  };

  const handleSelectProduct = (slug: string) => {
    navigateTo('product-details', slug);
    setIsSearchOpen(false);
  };

  const handleViewAllResults = (q: string) => {
    setSearchQuery(q);
    navigateTo('search');
    setIsSearchOpen(false);
  };

  const allAvailable = products && products.length > 0 ? products : PRODUCTS;
  const matchingProducts = term.trim()
    ? allAvailable.filter((p) => {
        const query = term.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(query) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
        );
      })
    : [];

  const trendingSearches = [
    'Handmade Bouquet',
    'BTS Mikrokosmos',
    'Couples Frame',
    'Memory Shadowbox',
    'Borahae Whale',
    'Velvet Jewelry Vault',
  ];

  const quickCategories = [
    { label: 'Handmade Studio', page: 'handmade' as const, icon: 'gesture' },
    { label: 'BTS Universe', page: 'bts' as const, icon: 'auto_awesome' },
    { label: 'Couples & Vows', page: 'couples' as const, icon: 'favorite' },
    { label: 'All Keepsakes', page: 'shop' as const, icon: 'featured_seasonal_and_gifts' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#FFF9F5]/98 dark:bg-background/98 backdrop-blur-3xl overflow-hidden transition-all duration-300 ease-out animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Search Keepsakes"
    >
      {/* Top Search Bar Header */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          {/* Back / Close button */}
          <button
            onClick={handleClose}
            aria-label="Back"
            className="w-10 h-10 rounded-full liquid-glass-tier-1 flex items-center justify-center text-[#4A234A] cursor-pointer active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>

          {/* Search Input Container */}
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-secondary pointer-events-none">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && term.trim()) {
                  handleViewAllResults(term.trim());
                }
              }}
              placeholder="Search bouquets, BTS keepsakes, vows..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full liquid-glass-tier-1 border border-[#C9A46C]/40 text-sm font-body-md text-[#4A234A] placeholder:text-[#867277] focus:outline-none focus:border-[#4A234A] transition-colors"
            />
            {term && (
              <button
                onClick={() => setTerm('')}
                className="absolute right-3 w-5 h-5 rounded-full bg-secondary-container text-primary flex items-center justify-center text-xs cursor-pointer active:scale-90"
                aria-label="Clear Search"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spacious Search Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* If no search term entered: Show Trending & Curated Suggestions */}
        {!term.trim() && (
          <>
            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-secondary font-label-sm text-xs tracking-wider uppercase font-semibold">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setTerm(item)}
                    className="px-3.5 py-1.5 rounded-full liquid-glass-tier-1 border border-outline-variant/40 text-xs font-medium text-[#4A234A] hover:bg-secondary-container/40 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Collections */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-secondary font-label-sm text-xs tracking-wider uppercase font-semibold">
                <span className="material-symbols-outlined text-[16px]">explore</span>
                <span>Explore Sanctuary</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {quickCategories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      navigateTo(cat.page);
                      setIsSearchOpen(false);
                    }}
                    className="p-3.5 rounded-2xl liquid-glass-tier-1 border border-outline-variant/30 flex items-center gap-3 text-left hover:bg-white/80 active:scale-98 transition-all cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary-container/60 flex items-center justify-center text-[#4A234A] flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {cat.icon}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#4A234A] leading-tight">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Picks */}
            <div>
              <div className="flex items-center justify-between mb-3 text-secondary font-label-sm text-xs tracking-wider uppercase font-semibold">
                <span>Atelier Favorites</span>
                <span className="text-[11px] font-normal lowercase tracking-normal">
                  handcrafted with heart
                </span>
              </div>
              <div className="space-y-2.5">
                {PRODUCTS.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.slug)}
                    className="p-3 rounded-2xl liquid-glass-tier-1 border border-white/60 flex items-center gap-3.5 cursor-pointer active:scale-98 transition-all hover:bg-white/70"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#4A234A] truncate">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-secondary truncate mt-0.5">
                        {prod.categoryLabel}
                      </p>
                      <span className="text-xs font-bold text-[#4A234A] block mt-1">
                        ₹{Math.round(prod.price * 82).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* If search term entered: Real-time Live Matching Results */}
        {term.trim() && (
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs text-secondary font-medium">
                {matchingProducts.length}{' '}
                {matchingProducts.length === 1 ? 'keepsake found' : 'keepsakes found'}
              </span>
              {matchingProducts.length > 0 && (
                <button
                  onClick={() => handleViewAllResults(term)}
                  className="text-xs font-semibold text-[#4A234A] hover:underline cursor-pointer"
                >
                  View full catalog →
                </button>
              )}
            </div>

            {matchingProducts.length > 0 ? (
              <div className="space-y-3">
                {matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl liquid-glass-tier-1 border border-white/80 flex gap-3.5 items-center hover:bg-white/80 transition-all"
                  >
                    <div
                      onClick={() => handleSelectProduct(p.slug)}
                      className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => handleSelectProduct(p.slug)}
                        className="font-headline-sm text-sm text-[#4A234A] truncate cursor-pointer hover:underline font-bold"
                      >
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {p.shortDescription}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-xs text-[#4A234A]">
                          ₹{Math.round(p.price * 82).toLocaleString('en-IN')}
                        </span>
                        <AnimatedAddToCartButton
                          onAdd={() => {
                            addToCart(p, 1);
                            showToast(`Added ${p.name} to Bag! 🎁`);
                          }}
                          label="Add to Bag"
                          className="px-3 py-1 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-[#4A234A] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[24px]">search_off</span>
                </div>
                <h3 className="font-headline-sm text-base text-[#4A234A] font-bold">
                  No bespoke keepsakes found
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                  We couldn't find matches for "{term}". Try searching for floral bouquets, memory boxes, or Borahae keepsakes.
                </p>
                <button
                  onClick={() => setTerm('')}
                  className="mt-2 text-xs font-semibold text-[#4A234A] underline cursor-pointer"
                >
                  Clear search and view all
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
