import React from 'react';
import { useShop } from '../../context/ShopContext';

export const MobileBottomBar: React.FC = () => {
  const { currentPage, navigateTo, wishlist, user, setIsSearchOpen, isSearchOpen } = useShop();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      onClick: () => {
        setIsSearchOpen(false);
        navigateTo('home');
      },
    },
    {
      id: 'search',
      label: 'Search',
      icon: 'search',
      onClick: () => {
        setIsSearchOpen(false);
        navigateTo('search');
      },
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: 'favorite',
      badge: wishlist.length,
      onClick: () => {
        setIsSearchOpen(false);
        navigateTo('wishlist');
      },
    },
    {
      id: 'account',
      label: user ? 'Account' : 'Sign In',
      icon: 'person',
      onClick: () => {
        setIsSearchOpen(false);
        navigateTo(user ? 'account' : 'login');
      },
    },
  ];

  // Dynamic active index calculation based on current router state
  const getActiveIndex = () => {
    if (currentPage === 'home') return 0;
    if (currentPage === 'search' || isSearchOpen) return 1;
    if (currentPage === 'wishlist') return 2;
    if (
      currentPage === 'login' ||
      currentPage === 'signup' ||
      currentPage === 'forgot-password' ||
      currentPage === 'account'
    ) {
      return 3;
    }
    return -1;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 pb-[env(safe-area-inset-bottom,0px)]">
      {/* Floating Glass Dock Container */}
      <nav
        role="navigation"
        aria-label="Wishmint Mobile Navigation Dock"
        className="pointer-events-auto relative w-full max-w-[360px] h-[58px] rounded-full bg-[#FFF9F5]/94 backdrop-blur-2xl border border-[#C9A46C]/30 shadow-[0_12px_36px_rgba(74,35,74,0.14),0_2px_10px_rgba(201,164,108,0.12)] px-1 flex items-center justify-between"
      >
        {/* Subtle Luxury Inner Glow Rim */}
        <div
          className="absolute inset-0 rounded-full border border-white/70 pointer-events-none"
          aria-hidden="true"
        />

        {/* =========================================================
            SMOOTH SLIDING ELEVATED ACTIVE BEAD (Meniscus Pattern)
            Slides horizontally across all 4 tab columns with icon in middle
            ========================================================= */}
        {activeIndex !== -1 && (
          <div
            className="absolute top-0 bottom-0 w-1/4 pointer-events-none flex items-center justify-center transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          >
            {/* Elevated circular pod rising above the dock bar */}
            <div className="relative w-[50px] h-[50px] -translate-y-4 rounded-full bg-gradient-to-b from-[#5F2F5F] to-[#4A234A] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(74,35,74,0.4),0_2px_8px_rgba(201,164,108,0.25)] border-[2.5px] border-[#FFF9F5] ring-1 ring-[#C9A46C]/40 animate-fadeIn">
              <span
                className="material-symbols-outlined text-[25px] text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {navItems[activeIndex].icon}
              </span>

              {/* Wishlist item counter badge on active bead */}
              {activeIndex === 2 && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center border border-white shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            FOUR NAVIGATION TAB COLUMNS (Home, Search, Wishlist, Sign In)
            Icons centered vertically and horizontally in the dock
            ========================================================= */}
        {navItems.map((item, idx) => {
          const isActive = activeIndex === idx;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-label={item.label}
              className="relative w-1/4 h-full flex items-center justify-center cursor-pointer select-none focus:outline-none group active:scale-95 transition-transform"
            >
              {/* Inactive Icon centered right in the middle */}
              <div
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
                }`}
              >
                <span className="material-symbols-outlined text-[24px] text-[#867277] group-hover:text-[#4A234A] transition-colors">
                  {item.icon}
                </span>

                {/* Wishlist badge for inactive state */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#4A234A] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
