import React from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';

export const MobileCouplesPage: React.FC = () => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, showToast } = useShop();
  const couplesProducts = PRODUCTS.filter((p) => p.category === 'couples');

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Unconditional Ties
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Couples & Anniversaries
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto mt-1">
          Spotify soundwave memory frames, coordinates of first dates, and wax-sealed love letters.
        </p>
      </div>

      <div className="p-5 rounded-2xl liquid-glass-tier-2 border border-secondary-container/60 mb-6">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
          <img
            src="/src/assets/images/wishmint_couples_frame_1790798389948.jpg"
            alt="Couples Frame"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="absolute top-2.5 right-2.5 bg-[#4A234A] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
            Anniversary
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#241B22]">Acoustic Memory Spotify Frame</h3>
        <p className="font-body-sm text-xs text-[#534247] mt-1 mb-3">
          Archival glass frame with your song soundwave and scannable Spotify barcode in metallic gold.
        </p>
        <AnimatedAddToCartButton
          onAdd={() => {
            addToCart(PRODUCTS[3], 1);
            showToast('Added Couples Acoustic Frame to Bag! 💖');
          }}
          label="Customize Frame (₹3,999)"
          className="w-full py-3"
        />
      </div>

      <div className="space-y-4">
        {couplesProducts.map((p) => {
          const wishlisted = isWishlisted(p.id);
          return (
            <div key={p.id} className="p-4 rounded-2xl liquid-glass-tier-1 border border-white flex gap-4 items-center">
              <div
                onClick={() => navigateTo('product-details', p.slug)}
                className="w-20 h-20 rounded-xl overflow-hidden bg-[#FFFDFB] p-1.5 flex items-center justify-center border border-[#EADBCE]/40 flex-none cursor-pointer"
              >
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain object-center" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => navigateTo('product-details', p.slug)}
                  className="font-serif text-[15px] font-semibold text-[#241B22] truncate cursor-pointer hover:underline"
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
                      addToCart(p, 1);
                      showToast(`Added ${p.name} to Bag! 🎁`);
                    }}
                    label="Add"
                    className="px-3.5 py-1.5 text-[11px]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
