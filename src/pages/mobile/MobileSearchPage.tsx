import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';

const RECENT_SEARCHES_KEY = 'wishmint_recent_searches';
const MAX_RECENT_SEARCHES = 5;

const POPULAR_SUGGESTIONS = [
  'Handmade Bouquet',
  'BTS Whale',
  'Spotify Frame',
  'Memory Trunk',
  'Yarn Art',
];

export const MobileSearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery, navigateTo, addToCart, showToast, products } = useShop();
  const [inputVal, setInputVal] = useState(searchQuery);

  // Initialize recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENT_SEARCHES);
        }
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
    }
    return [];
  });

  // Sync inputVal when global searchQuery changes externally
  useEffect(() => {
    if (searchQuery !== inputVal) {
      setInputVal(searchQuery);
    }
  }, [searchQuery]);

  // Save query to localStorage (maintaining top 5 most recent, unique)
  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    try {
      const existing = recentSearches.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...existing].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (e) {
      console.error('Error saving recent search:', e);
    }
  };

  // Remove a single recent search term
  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((item) => item !== termToRemove);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (e) {
      console.error('Error removing recent search:', e);
    }
  };

  // Clear all recent searches
  const clearAllRecentSearches = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (e) {
      console.error('Error clearing recent searches:', e);
    }
  };

  // Select a recent search or suggested query
  const handleSelectQuery = (term: string) => {
    setInputVal(term);
    setSearchQuery(term);
    saveSearchQuery(term);
  };

  // Handle form submission / Enter key
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      saveSearchQuery(inputVal.trim());
    }
  };

  const allAvailable = products && products.length > 0 ? products : PRODUCTS;
  const activeQuery = (inputVal || searchQuery || '').trim().toLowerCase();

  const matching = allAvailable.filter((p) => {
    if (!activeQuery) return true;
    return (
      p.name.toLowerCase().includes(activeQuery) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(activeQuery)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(activeQuery)) ||
      (p.description && p.description.toLowerCase().includes(activeQuery)) ||
      (p.category && p.category.toLowerCase().includes(activeQuery))
    );
  });

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Search Keepsakes
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Discover Gifts
        </h1>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            setSearchQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
          placeholder="Search bouquets, BTS keepsakes, frames..."
          className="w-full pl-11 pr-10 py-3 rounded-full bg-white/95 border border-[#C9A46C]/40 text-sm font-medium text-[#4A234A] placeholder:text-[#867277] shadow-sm outline-none focus:border-[#4A234A] transition-colors"
        />
        <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[20px] text-[#4A234A] pointer-events-none">
          search
        </span>

        {inputVal && (
          <button
            type="button"
            onClick={() => {
              setInputVal('');
              setSearchQuery('');
            }}
            aria-label="Clear Search"
            className="absolute right-3.5 top-3 w-6 h-6 rounded-full bg-[#FFF0F4] text-[#4A234A] flex items-center justify-center text-xs active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        )}
      </form>

      {/* ========================================================
          RECENT SEARCHES SECTION (Stored in localStorage, max 5)
          ======================================================== */}
      {recentSearches.length > 0 ? (
        <div className="mb-6 bg-white/70 backdrop-blur-md rounded-2xl p-3.5 border border-[#EADBCE]/70 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4A234A]">
                history
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A234A]">
                Recent Searches
              </span>
            </div>
            <button
              type="button"
              onClick={clearAllRecentSearches}
              className="text-[11px] font-semibold text-[#867277] hover:text-[#ba1a1a] transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          {/* Recent Query Chips */}
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <div
                key={`${term}-${index}`}
                onClick={() => handleSelectQuery(term)}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF5F8] border border-[#E2B7C8] hover:border-[#C9A46C] text-[#4A234A] text-xs font-medium shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[13px] text-[#867277] group-hover:text-[#4A234A]">
                  schedule
                </span>
                <span>{term}</span>
                <button
                  type="button"
                  onClick={(e) => removeRecentSearch(term, e)}
                  aria-label={`Remove recent search ${term}`}
                  className="text-[#867277] hover:text-[#ba1a1a] ml-1 p-0.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Suggested Searches (when user has no recent searches yet) */
        <div className="mb-6 bg-white/60 backdrop-blur-md rounded-2xl p-3.5 border border-[#EADBCE]/50">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="material-symbols-outlined text-[16px] text-[#4A234A]">
              trending_up
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A234A]">
              Suggested Keepsakes
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectQuery(term)}
                className="px-3 py-1.5 rounded-full bg-[#FFF5F8] border border-[#E2B7C8]/70 hover:border-[#C9A46C] text-[#4A234A] text-xs font-medium shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result Count Status */}
      <div className="flex items-center justify-between mb-3 text-xs text-[#534247] px-1 font-medium">
        <span>
          {matching.length} {matching.length === 1 ? 'gift found' : 'gifts found'}
          {activeQuery && (
            <span className="text-[#4A234A] font-semibold"> for &ldquo;{activeQuery}&rdquo;</span>
          )}
        </span>
        {activeQuery && (
          <button
            type="button"
            onClick={() => {
              setInputVal('');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#4A234A] hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Products Results List */}
      {matching.length > 0 ? (
        <div className="space-y-4">
          {matching.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl liquid-glass-tier-1 border border-white flex gap-4 items-center"
            >
              {/* Product 1:1 Image with contain and single clean container */}
              <div
                onClick={() => {
                  if (activeQuery) saveSearchQuery(activeQuery);
                  navigateTo('product-details', p.slug);
                }}
                className="w-20 h-20 aspect-square rounded-xl overflow-hidden flex-none cursor-pointer"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => {
                    if (activeQuery) saveSearchQuery(activeQuery);
                    navigateTo('product-details', p.slug);
                  }}
                  className="font-serif text-[15px] font-bold text-[#4A234A] truncate cursor-pointer hover:underline"
                >
                  {p.name}
                </h4>
                <p className="text-[11px] text-[#534247] line-clamp-1">{p.shortDescription}</p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="font-bold text-[#4A234A] tabular-nums tracking-tight"
                    style={{ fontSize: '1.25rem', color: '#4A234A' }}
                  >
                    ₹{Math.round(p.price < 150 ? p.price * 82 : p.price).toLocaleString('en-IN')}
                  </span>
                  <AnimatedAddToCartButton
                    onAdd={() => {
                      if (activeQuery) saveSearchQuery(activeQuery);
                      addToCart(p, 1);
                      showToast(`Added ${p.name} to Bag! 🎁`);
                    }}
                    label="Add"
                    className="px-3.5 py-1.5 text-[11px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 space-y-3 liquid-glass-tier-1 rounded-3xl border border-white/80 my-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <h3 className="font-headline-sm text-base text-primary font-bold">
            No products found
          </h3>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            We couldn&apos;t find any keepsakes matching &ldquo;{activeQuery}&rdquo;. Try selecting one of the suggested gifts above.
          </p>
          <button
            type="button"
            onClick={() => {
              setInputVal('');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-semibold text-primary underline cursor-pointer"
          >
            Clear search &amp; show all gifts
          </button>
        </div>
      )}
    </div>
  );
};
