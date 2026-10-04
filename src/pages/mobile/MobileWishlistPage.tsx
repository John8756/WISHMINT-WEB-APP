import React from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';

export const MobileWishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigateTo, showToast } = useShop();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Saved Registry
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Wishlist ({wishlistedProducts.length})
        </h1>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="space-y-4">
          {wishlistedProducts.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl liquid-glass-tier-1 border border-white flex gap-4 items-center relative">
              <div
                onClick={() => navigateTo('product-details', p.slug)}
                className="w-18 h-18 rounded-xl overflow-hidden bg-[#FFFDFB] p-1.5 flex items-center justify-center border border-[#EADBCE]/40 flex-none cursor-pointer"
              >
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain object-center" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h4
                  onClick={() => navigateTo('product-details', p.slug)}
                  className="font-serif text-[15px] font-semibold text-[#241B22] truncate cursor-pointer hover:underline"
                >
                  {p.name}
                </h4>
                <span
                  className="font-bold text-[#4A234A] tabular-nums block mt-1 tracking-tight"
                  style={{ fontSize: '1.25rem', color: '#4A234A' }}
                >
                  ₹{Math.round(p.price < 150 ? p.price * 82 : p.price).toLocaleString('en-IN')}
                </span>
                <AnimatedAddToCartButton
                  onAdd={() => {
                    addToCart(p, 1);
                    showToast(`Moved ${p.name} to Bag! 🎁`);
                  }}
                  label="Move to Bag"
                  className="mt-2 px-3.5 py-1.5 text-[11px]"
                />
              </div>
              <button
                onClick={() => toggleWishlist(p.id)}
                className="absolute top-3 right-3 text-outline hover:text-error cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-2xl liquid-glass-tier-1 border border-white text-center my-8">
          <span className="material-symbols-outlined text-[48px] text-secondary-container mb-2">
            bookmark_border
          </span>
          <h3 className="font-headline-sm text-lg text-primary mb-1">Your Wishlist Is Empty</h3>
          <p className="text-xs text-on-surface-variant mb-5">
            Save items here to revisit them anytime.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-label-md"
          >
            Browse Vault
          </button>
        </div>
      )}
    </div>
  );
};
