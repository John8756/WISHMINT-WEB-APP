import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useWordPress } from '../../context/WordPressContext';
import { Page } from '../../types';
import { PRODUCTS } from '../../data/products';
import { decodeHtmlEntities } from '../../services/wpService';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const {
    navigateTo,
    user,
    setIsSearchOpen,
    setSearchQuery,
    categories,
    categoriesLoading,
    selectedCategory,
    setSelectedCategory,
  } = useShop();
  const { pages } = useWordPress();
  const [drawerSearchExpanded, setDrawerSearchExpanded] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleNav = (page: Page, slug?: string) => {
    navigateTo(page, slug);
    onClose();
  };

  const handleDrawerSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerSearchQuery.trim()) {
      setSearchQuery(drawerSearchQuery.trim());
      handleNav('search');
    }
  };

  const matchingDrawerProducts = drawerSearchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const q = drawerSearchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      }).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#341534]/50 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Drawer Container — Responsive, Safe Margins, Zero Text Overflow */}
      <div className="relative w-[86vw] max-w-[340px] min-w-[275px] bg-[#FFF9F5]/98 backdrop-blur-3xl h-full shadow-2xl z-10 flex flex-col justify-between p-4 sm:p-5 border-r border-[#C9A46C]/30 overflow-x-hidden overflow-y-auto box-border transition-transform duration-300">
        <div className="w-full">
          {/* Brand Header with Emblem & Wordmark (Premium Burgundy/Plum Palette) */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#C9A46C]/20 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C9A46C] shadow-xs bg-[#4A234A] flex-none flex items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7W6ARsfE0nqLDJcj1xtV9pweRokgMxuA31TG48V0vd37dMtmghM7AXlVQHc2VcYhaFzxun6zHxbzgGsDnx3AX33BWbuIxtAQpEQ-NZjygTDp7BDNu1cu87KGB1wxXZxtTHf6QEk0pRZQw29k4GeCfhXqziChghR_gkEvnyWzHAafATJL_z5Zqq_EeYoIKTCp7vIDoTlHVbivQk2ijOooKiZBJ0wwRLLIq0RZ0Fjn3oT0RXtS6ioY8SdRxcbguDr4aJuc"
                  alt="WISHMINT"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="font-serif text-[#4A234A] font-bold text-base sm:text-lg tracking-[0.16em] uppercase block leading-none truncate">
                  WISHMINT
                </span>
                <span className="text-[8.5px] text-[#9A7036] tracking-[0.22em] uppercase font-sans font-semibold mt-0.5 block truncate">
                  Keepsake Sanctuary
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Navigation"
              className="w-8 h-8 rounded-full bg-[#FFF0F4] border border-[#E2B7C8] flex items-center justify-center text-[#4A234A] cursor-pointer active:scale-90 transition-transform flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Search Section within Menu */}
          <div className="mb-4">
            {!drawerSearchExpanded ? (
              <button
                onClick={() => setDrawerSearchExpanded(true)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white/80 border border-[#C9A46C]/30 flex items-center justify-between text-left text-xs text-[#867277] hover:text-[#4A234A] hover:border-[#C9A46C] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-[18px] text-[#4A234A] flex-shrink-0">
                    search
                  </span>
                  <span className="truncate">Search Atelier Keepsakes...</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A46C] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                  Open
                </span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-white/90 border border-[#C9A46C]/40 space-y-2.5 animate-fadeIn">
                <form onSubmit={handleDrawerSearchSubmit} className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-[17px] text-[#4A234A] pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    value={drawerSearchQuery}
                    onChange={(e) => setDrawerSearchQuery(e.target.value)}
                    placeholder="Search bouquets, boxes..."
                    className="w-full pl-8 pr-14 py-2 rounded-lg bg-white border border-[#C9A46C]/30 text-xs text-[#4A234A] placeholder:text-[#867277] focus:outline-none focus:border-[#4A234A]"
                    autoFocus
                  />
                  <div className="absolute right-1 flex items-center gap-1">
                    {drawerSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setDrawerSearchQuery('')}
                        className="w-4 h-4 rounded-full bg-secondary-container text-primary flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerSearchExpanded(false);
                        setDrawerSearchQuery('');
                      }}
                      className="text-[10px] text-secondary hover:text-primary px-1.5 py-0.5 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </form>

                {/* Live Quick Matches */}
                {drawerSearchQuery.trim() && matchingDrawerProducts.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {matchingDrawerProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleNav('product-details', p.slug)}
                        className="p-1.5 rounded-lg hover:bg-[#FFF0F4] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-[#4A234A] truncate">
                            {p.name}
                          </p>
                          <span className="text-[10px] text-[#C9A46C] font-bold">
                            ₹{Math.round(p.price * 82).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(drawerSearchQuery);
                        handleNav('search');
                      }}
                      className="w-full text-center py-1 text-[11px] font-semibold text-[#4A234A] hover:underline block cursor-pointer"
                    >
                      View all matches →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-sm font-medium text-[#4A234A]">
            {/* 1. Primary Sanctuary (Home) */}
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FFF0F4] flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[#4A234A] text-[20px] flex-shrink-0">
                home
              </span>
              <span className="flex-1 min-w-0 truncate text-sm font-medium">Sanctuary (Home)</span>
              <span className="material-symbols-outlined text-[16px] text-[#C9A46C] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                chevron_right
              </span>
            </button>

            {/* 2. All Keepsakes Vault */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                handleNav('shop');
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FFF0F4] flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[#4A234A] text-[20px] flex-shrink-0">
                featured_seasonal_and_gifts
              </span>
              <span className="flex-1 min-w-0 truncate text-sm font-medium">All Keepsakes Vault</span>
              <span className="material-symbols-outlined text-[16px] text-[#C9A46C] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                chevron_right
              </span>
            </button>

            {/* ========================================================
                3. DYNAMIC WOOCOMMERCE CATEGORIES SECTION
                Fetched directly from backend without hardcoding
                ======================================================== */}
            <div className="pt-3 pb-1 border-t border-[#C9A46C]/15 my-2">
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#867277]">
                  Categories
                </span>
                {categoriesLoading && (
                  <span className="text-[9px] text-[#C9A46C] font-medium animate-pulse">
                    Loading...
                  </span>
                )}
              </div>

              <div className="space-y-0.5 mt-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        handleNav('shop');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group active:scale-98 ${
                        isSelected
                          ? 'bg-[#FFF0F4] text-[#4A234A] font-semibold border border-[#E2B7C8]/70'
                          : 'hover:bg-[#FFF0F4] text-[#4A234A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-[18px] text-[#C9A46C] group-hover:text-[#4A234A] transition-colors flex-shrink-0">
                          label
                        </span>
                        <span className="truncate text-sm font-medium">
                          {decodeHtmlEntities(cat.name)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {cat.count > 0 && (
                          <span className="text-[10px] font-semibold text-[#867277] bg-[#FFF5F8] border border-[#EADBCE] px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        )}
                        <span className="material-symbols-outlined text-[16px] text-[#C9A46C] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                          chevron_right
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Empty State Fallback if categories are being provisioned */}
                {!categoriesLoading && categories.length === 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      handleNav('shop');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF0F4] text-[#867277] text-xs flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    <span>Browse All Keepsakes</span>
                  </button>
                )}
              </div>
            </div>

            {/* 4. Utility Links: Saved Registry & Account */}
            <div className="pt-2 border-t border-[#C9A46C]/15 space-y-1">
              <button
                onClick={() => handleNav('wishlist')}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF0F4] flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[#4A234A] text-[20px] flex-shrink-0">
                  bookmark
                </span>
                <span className="flex-1 min-w-0 truncate text-sm font-medium">Saved Wishlist</span>
                <span className="material-symbols-outlined text-[16px] text-[#C9A46C] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => handleNav(user ? 'account' : 'login')}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF0F4] flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[#4A234A] text-[20px] flex-shrink-0">
                  person
                </span>
                <span className="flex-1 min-w-0 truncate text-sm font-medium">
                  {user ? 'My Orders & Account' : 'Sign In / Register'}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#C9A46C] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Dynamic Custom Pages from WordPress (Excluding Policy/System Slugs) */}
            {pages
              .filter(
                (p) =>
                  ![
                    'home',
                    'shop',
                    'handmade',
                    'bts',
                    'couples',
                    'about',
                    'contact',
                    'faq',
                    'shipping',
                    'shipping-policy',
                    'returns',
                    'returns-policy',
                    'returns-replacement-guarantee',
                    'privacy',
                    'privacy-policy',
                    'terms',
                    'terms-conditions',
                    'terms-and-conditions',
                    'refund',
                    'refund-policy',
                    'cookie-policy',
                    'disclaimer',
                  ].includes(p.slug.toLowerCase())
              )
              .map((p) => (
                <button
                  key={p.slug}
                  onClick={() => handleNav(p.slug as Page)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF0F4] flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[#C9A46C] text-[18px] flex-shrink-0">
                    description
                  </span>
                  <span className="flex-1 min-w-0 truncate text-xs font-medium text-brand-dark">
                    {decodeHtmlEntities(p.title)}
                  </span>
                </button>
              ))}
          </nav>
        </div>

        {/* Drawer Bottom Footer */}
        <div className="pt-4 border-t border-[#C9A46C]/20 text-center">
          <p className="text-[10px] text-[#867277] font-medium">
            Wishmint Keepsake Sanctuary
          </p>
          <span className="text-[9px] text-[#C9A46C] block mt-0.5 tracking-wider uppercase font-semibold">
            Artisanal Handcrafting
          </span>
        </div>
      </div>
    </div>
  );
};
