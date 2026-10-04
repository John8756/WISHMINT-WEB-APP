import React from 'react';
import { useShop } from '../../context/ShopContext';

interface MobileTopBarProps {
  onOpenMenu: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({ onOpenMenu }) => {
  const { navigateTo, cart, setIsSearchOpen } = useShop();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 mobile-topbar-wrapper pb-3 backdrop-blur-2xl bg-[#FFF9F5]/98 shadow-[0_2px_12px_rgba(74,35,74,0.06)] border-b border-[#C9A46C]/35">
      {/* Left: Navigation Drawer Toggle with high-contrast soft pink aesthetic */}
      <div className="flex items-center">
        <button
          onClick={onOpenMenu}
          aria-label="Open Navigation Menu"
          className="w-10 h-10 rounded-full bg-[#FFF0F4] border border-[#E2B7C8] shadow-xs flex items-center justify-center text-[#4A234A] active:scale-95 transition-all duration-200 cursor-pointer hover:bg-[#FCE8EF] hover:border-[#C9A46C]"
        >
          <span className="material-symbols-outlined text-[22px] text-[#4A234A] font-semibold">
            menu
          </span>
        </button>
      </div>

      {/* Center: WISHMINT Brand Mark + Wordmark (High contrast, clearly visible) */}
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        aria-label="WISHMINT Home"
      >
        {/* Emblem badge with rich plum background & gold rim for clear logo visibility */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C9A46C] shadow-sm bg-[#4A234A] flex-none flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7W6ARsfE0nqLDJcj1xtV9pweRokgMxuA31TG48V0vd37dMtmghM7AXlVQHc2VcYhaFzxun6zHxbzgGsDnx3AX33BWbuIxtAQpEQ-NZjygTDp7BDNu1cu87KGB1wxXZxtTHf6QEk0pRZQw29k4GeCfhXqziChghR_gkEvnyWzHAafATJL_z5Zqq_EeYoIKTCp7vIDoTlHVbivQk2ijOooKiZBJ0wwRLLIq0RZ0Fjn3oT0RXtS6ioY8SdRxcbguDr4aJuc"
            alt="WISHMINT"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-serif tracking-[0.18em] text-[17.5px] font-bold text-[#4A234A] uppercase leading-none">
            WISHMINT
          </span>
          <span className="text-[8.5px] tracking-[0.24em] text-[#9A7036] uppercase font-sans font-semibold mt-0.5 leading-none">
            Artisanal Gifting
          </span>
        </div>
      </button>

      {/* Right: High-contrast Search & Keepsake Bag actions */}
      <div className="flex items-center space-x-2">
        {/* Dedicated Search Action */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search Keepsakes"
          className="w-10 h-10 rounded-full bg-[#FFF0F4] border border-[#E2B7C8] shadow-xs flex items-center justify-center text-[#4A234A] hover:bg-[#FCE8EF] hover:border-[#C9A46C] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[#4A234A] font-semibold">
            search
          </span>
        </button>

        {/* Keepsake Bag Action */}
        <button
          onClick={() => navigateTo('cart')}
          aria-label="Keepsake Bag"
          className="relative w-10 h-10 rounded-full bg-[#FFF0F4] border border-[#E2B7C8] shadow-xs flex items-center justify-center text-[#4A234A] hover:bg-[#FCE8EF] hover:border-[#C9A46C] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[#4A234A] font-semibold">
            shopping_bag
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#4A234A] text-white font-sans text-[9px] font-bold flex items-center justify-center border-2 border-[#FFF9F5] shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
