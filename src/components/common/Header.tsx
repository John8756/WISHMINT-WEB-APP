import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useWordPress } from '../../context/WordPressContext';
import { PRODUCTS } from '../../data/products';
import { Page } from '../../types';
import {
  Search,
  User as UserIcon,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

// Helper to decode HTML entities like &#038;, &amp;, &#8217;, etc.
function decodeHtmlEntities(str: string): string {
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

// Slugs that must never appear in primary top header navigation
const EXCLUDED_HEADER_PAGES = new Set([
  'home',
  'shop',
  'handmade',
  'bts',
  'couples',
  'about',
  'contact',
  'about-us',
  'contact-us',
  'concierge',
  'cart',
  'checkout',
  'account',
  'my-account',
  'login',
  'signup',
  'forgot-password',
  'product-details',
  'search',
  'wishlist',
  'order-confirmation',
  // Legal & policy pages (strictly belong in the footer)
  'terms',
  'terms-conditions',
  'terms-and-conditions',
  'privacy',
  'privacy-policy',
  'returns',
  'returns-replacement-guarantee',
  'returns-and-replacement-guarantee',
  'returns-and-replacements',
  'refund',
  'refund-policy',
  'shipping',
  'shipping-policy',
  'cookie-policy',
  'disclaimer',
  'sample-page',
  'faq',
]);

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cart,
    wishlist,
    user,
    searchQuery,
    setSearchQuery,
    products,
  } = useShop();

  const { navItems } = useWordPress();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const allAvailableProducts = products && products.length > 0 ? products : PRODUCTS;
  const liveMatchingProducts = localSearch.trim()
    ? allAvailableProducts.filter((p) => {
        const q = localSearch.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      })
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigateTo('search');
      setSearchOpen(false);
    }
  };

  // Base luxury atelier navigation links
  const defaultNavLinks: { label: string; page: Page; isBts?: boolean }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop All', page: 'shop' },
    { label: 'Handmade', page: 'handmade' },
    { label: 'BTS ARMY', page: 'bts', isBts: true },
    { label: 'Couples', page: 'couples' },
  ];

  const isPolicyOrExcludedSlug = (slug: string, label?: string) => {
    const s = String(slug || '').toLowerCase();
    const l = String(label || '').toLowerCase();
    if (EXCLUDED_HEADER_PAGES.has(s)) return true;
    if (
      s.includes('policy') ||
      s.includes('terms') ||
      s.includes('return') ||
      s.includes('refund') ||
      s.includes('shipping') ||
      s.includes('guarantee') ||
      s.includes('privacy') ||
      s.includes('cookie') ||
      s.includes('disclaimer') ||
      s.includes('faq') ||
      s.includes('about') ||
      s.includes('contact') ||
      s.includes('concierge') ||
      s.includes('atelier') ||
      l.includes('contact') ||
      l.includes('about') ||
      l.includes('concierge') ||
      l.includes('atelier')
    ) {
      return true;
    }
    return false;
  };

  // Merge any dynamic custom product/editorial pages published in WordPress (excluding policies, contact, about, and system pages)
  const customWpLinks = navItems
    .filter((item) => item.isCustom && !isPolicyOrExcludedSlug(item.slug, item.label))
    .slice(0, 2)
    .map((item) => ({
      label: decodeHtmlEntities(item.label),
      page: item.slug as Page,
      isBts: false,
    }));

  const allNavLinks = [...defaultNavLinks, ...customWpLinks];

  return (
    <>
      <header
        id="site-header"
        className={`liquid-glass-header fixed top-0 left-0 right-0 z-50 px-5 md:px-12 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'scrolled py-2.5' : 'py-3.5 md:py-4'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          {/* Brand Logo & Emblem (Beside Wordmark) */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="Wishmint Home"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C9A46C]/70 shadow-sm transition-transform duration-500 group-hover:scale-105 bg-[#FFF9F5] flex-none flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7W6ARsfE0nqLDJcj1xtV9pweRokgMxuA31TG48V0vd37dMtmghM7AXlVQHc2VcYhaFzxun6zHxbzgGsDnx3AX33BWbuIxtAQpEQ-NZjygTDp7BDNu1cu87KGB1wxXZxtTHf6QEk0pRZQw29k4GeCfhXqziChghR_gkEvnyWzHAafATJL_z5Zqq_EeYoIKTCp7vIDoTlHVbivQk2ijOooKiZBJ0wwRLLIq0RZ0Fjn3oT0RXtS6ioY8SdRxcbguDr4aJuc"
                alt="WISHMINT Ribbon Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.2em] text-xl font-semibold text-brand-plum uppercase leading-none">
                Wishmint
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#C9A46C] uppercase font-sans mt-0.5 font-medium">
                Artisanal Gifting
              </span>
            </div>
          </button>

          {/* Desktop Navigation — Luxury Editorial Typography & Refined Hover Indicator */}
          <nav className="hidden lg:flex items-center gap-1.5 liquid-glass-pill px-3 py-1.5 rounded-full border border-white/80 shadow-[0_4px_20px_rgba(74,35,74,0.03)] backdrop-blur-md">
            {allNavLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`relative font-serif text-[12.5px] xl:text-[13px] uppercase tracking-[0.14em] font-medium px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ease-out after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:rounded-full after:transition-all after:duration-250 after:ease-out ${
                    isActive
                      ? link.isBts
                        ? 'text-purple-900 bg-purple-100/70 shadow-xs after:w-3/5 after:bg-purple-800'
                        : 'text-brand-plum bg-white/70 shadow-xs after:w-3/5 after:bg-brand-plum font-semibold'
                      : link.isBts
                      ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-50/50 after:w-0 hover:after:w-3/5 hover:after:bg-purple-600/80'
                      : 'text-brand-gray hover:text-brand-plum hover:bg-white/50 after:w-0 hover:after:w-3/5 hover:after:bg-brand-rosegold/80'
                  }`}
                >
                  <span className="whitespace-nowrap">{decodeHtmlEntities(link.label)}</span>
                  {link.isBts && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Catalog"
              className="liquid-glass-pill w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-brand-plum hover:text-brand-rosegold transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* My Account */}
            <button
              onClick={() => navigateTo(user ? 'account' : 'login')}
              aria-label="My Account"
              className={`liquid-glass-pill w-9 h-9 sm:w-10 sm:h-10 rounded-full hidden sm:flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === 'account' || currentPage === 'login'
                  ? 'bg-white text-brand-rosegold shadow-sm'
                  : 'text-brand-plum hover:text-brand-rosegold'
              }`}
            >
              <UserIcon className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              aria-label="Wishlist"
              className={`liquid-glass-pill w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${
                currentPage === 'wishlist'
                  ? 'bg-white text-red-500 shadow-sm'
                  : 'text-brand-plum hover:text-red-500'
              }`}
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-plum text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigateTo('cart')}
              aria-label="Cart"
              className="liquid-glass-plum text-white px-3.5 sm:px-4 py-2 rounded-full flex items-center gap-2 sm:gap-2.5 shadow-md hover:brightness-110 transition-all group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-brand-blush" />
              <span className="text-xs font-semibold tracking-wider uppercase font-sans hidden sm:inline">
                Cart
              </span>
              <span className="bg-white/20 text-[11px] px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden liquid-glass-pill w-9 h-9 rounded-full flex items-center justify-center text-brand-plum cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Flyout Dropdown */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 p-4 sm:p-6 liquid-glass-card bg-brand-cream/98 border-b border-brand-rosegold/30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-brand-plum/60" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search bouquets, BTS keepsakes, Spotify frames, hampers..."
                  autoFocus
                  className="w-full pl-12 pr-28 py-3.5 rounded-full bg-white border border-brand-plum/20 text-brand-dark text-sm focus:outline-none focus:border-brand-rosegold shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2 rounded-full bg-brand-plum text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-plumDeep transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Real-time Matching Results as user types */}
              {localSearch.trim() ? (
                <div className="mt-4 pt-3 border-t border-brand-plum/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-brand-gray font-medium">
                      {liveMatchingProducts.length}{' '}
                      {liveMatchingProducts.length === 1 ? 'keepsake found' : 'keepsakes found'}
                    </span>
                    {liveMatchingProducts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="text-xs font-semibold text-brand-plum hover:underline cursor-pointer"
                      >
                        View all in search page →
                      </button>
                    )}
                  </div>

                  {liveMatchingProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto no-scrollbar py-1">
                      {liveMatchingProducts.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigateTo('product-details', item.slug);
                            setSearchOpen(false);
                          }}
                          className="p-2.5 rounded-2xl bg-white border border-brand-plum/10 flex items-center gap-3 hover:border-brand-rosegold/50 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-cream flex-none">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-serif font-bold text-brand-dark truncate group-hover:text-brand-plum">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-brand-gray block truncate">
                              {item.categoryLabel}
                            </span>
                            <span className="text-xs font-bold text-brand-plum block mt-0.5">
                              ₹{Math.round(item.price < 150 ? item.price * 82 : item.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Clean No Products Found state */
                    <div className="text-center py-7 px-4">
                      <p className="text-sm font-serif text-brand-dark font-medium">
                        No keepsakes found for &ldquo;{localSearch}&rdquo;
                      </p>
                      <p className="text-xs text-brand-gray mt-1">
                        Try searching for &lsquo;bouquet&rsquo;, &lsquo;whale&rsquo;, &lsquo;frame&rsquo;, or &lsquo;velvet&rsquo;
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Popular Search suggestions when input is empty */
                <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-gray overflow-x-auto no-scrollbar">
                  <span className="font-semibold text-brand-plum">Popular:</span>
                  {['Crochet Flowers', 'BTS Whale', 'Spotify Frame', 'Shadowbox', 'Love Letter'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setLocalSearch(tag);
                          setSearchQuery(tag);
                          navigateTo('search');
                          setSearchOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-brand-blush text-brand-dark border border-brand-plum/10 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-brand-plumDeep/80 backdrop-blur-xl z-50 flex flex-col justify-between p-8 transform transition-transform duration-500 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-rosegold/50">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7W6ARsfE0nqLDJcj1xtV9pweRokgMxuA31TG48V0vd37dMtmghM7AXlVQHc2VcYhaFzxun6zHxbzgGsDnx3AX33BWbuIxtAQpEQ-NZjygTDp7BDNu1cu87KGB1wxXZxtTHf6QEk0pRZQw29k4GeCfhXqziChghR_gkEvnyWzHAafATJL_z5Zqq_EeYoIKTCp7vIDoTlHVbivQk2ijOooKiZBJ0wwRLLIq0RZ0Fjn3oT0RXtS6ioY8SdRxcbguDr4aJuc"
                alt="WISHMINT"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif tracking-widest text-xl text-white font-medium">
              WISHMINT
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-5 my-auto text-center font-serif text-2xl text-brand-blush">
          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigateTo('shop');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors"
          >
            All Gifts & Keepsakes
          </button>
          <button
            onClick={() => {
              navigateTo('handmade');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors"
          >
            Handmade Studio
          </button>
          <button
            onClick={() => {
              navigateTo('bts');
              setMobileMenuOpen(false);
            }}
            className="hover:text-purple-300 transition-colors flex items-center justify-center gap-2"
          >
            <span>BTS ARMY Collection</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600 text-white font-sans font-medium">
              Borahae 💜
            </span>
          </button>
          <button
            onClick={() => {
              navigateTo('couples');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors"
          >
            Couples Keepsakes
          </button>
          <button
            onClick={() => {
              navigateTo(user ? 'account' : 'login');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors text-lg font-sans text-brand-rosegold"
          >
            {user ? 'My Account & Orders' : 'Sign In / Register'}
          </button>
          <button
            onClick={() => {
              navigateTo('about');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors text-base font-sans text-white/70"
          >
            About Our Atelier
          </button>
          <button
            onClick={() => {
              navigateTo('contact');
              setMobileMenuOpen(false);
            }}
            className="hover:text-white transition-colors text-base font-sans text-white/70"
          >
            Customer Care & Contact
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <button
            onClick={() => {
              navigateTo('shop');
              setMobileMenuOpen(false);
            }}
            className="w-full text-center py-3.5 rounded-full bg-brand-rosegold text-brand-dark font-sans font-semibold uppercase text-xs tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Customizing A Gift</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
