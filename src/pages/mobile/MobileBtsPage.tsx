import React from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';

export const MobileBtsPage: React.FC = () => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, showToast } = useShop();
  const btsProducts = PRODUCTS.filter((p) => p.category === 'bts');

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-tertiary-container uppercase tracking-widest block font-bold mb-1">
          Borahae Sanctuary
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          BTS ARMY Universe
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto mt-1">
          Dedicated keepsakes for the 7 hearts. Illuminated purple whales and Mikrokosmos music vaults.
        </p>
      </div>

      <div className="p-5 rounded-2xl liquid-glass-dark text-white border border-tertiary-fixed/30 mb-6">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
          <img
            src="/src/assets/images/wishmint_bts_whale_1790798376874.jpg"
            alt="BTS Whale Dome"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="absolute top-2.5 right-2.5 bg-tertiary-container text-tertiary-fixed text-[10px] font-label-sm px-2.5 py-0.5 rounded-full font-semibold shadow-xs">
            06.13 Sanctuary
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-tertiary-fixed">Borahae Starlight Whale Dome</h3>
        <p className="font-body-sm text-xs text-white/80 mt-1 mb-3">
          Hand-crocheted violet whale under an illuminated starlight cloche with gold star dust and touch-switch LED.
        </p>
        <AnimatedAddToCartButton
          onAdd={() => {
            addToCart(PRODUCTS[2], 1);
            showToast('Added BTS Starlight Dome to Bag! 💜');
          }}
          label="Claim ARMY Keepsake (₹5,999)"
          theme="purple"
          className="w-full py-3"
        />
      </div>

      <div className="space-y-4">
        {btsProducts.map((p) => {
          const wishlisted = isWishlisted(p.id);
          return (
            <div key={p.id} className="p-4 rounded-2xl liquid-glass-dark text-white border border-tertiary-fixed/20 flex gap-4 items-center">
              <div
                onClick={() => navigateTo('product-details', p.slug)}
                className="w-20 h-20 rounded-xl overflow-hidden bg-purple-950/70 p-1.5 flex items-center justify-center border border-purple-400/20 flex-none cursor-pointer"
              >
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain object-center" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => navigateTo('product-details', p.slug)}
                  className="font-serif text-[15px] font-semibold text-white truncate cursor-pointer hover:underline"
                >
                  {p.name}
                </h4>
                <p className="text-[11px] text-tertiary-fixed-dim line-clamp-1">{p.shortDescription}</p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="font-bold tabular-nums tracking-tight"
                    style={{ fontSize: '1.25rem', color: '#4A234A' }}
                  >
                    ₹{Math.round(p.price < 150 ? p.price * 82 : p.price).toLocaleString('en-IN')}
                  </span>
                  <AnimatedAddToCartButton
                    onAdd={() => {
                      addToCart(p, 1);
                      showToast(`Added ${p.name} to Bag! 💜`);
                    }}
                    label="Add"
                    theme="purple"
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
