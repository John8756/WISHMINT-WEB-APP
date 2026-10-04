import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { AnimatedAddToCartButton } from '../components/common/AnimatedAddToCartButton';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigateTo, showToast } = useShop();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      addToCart(p, 1);
    });
    showToast(`Added all ${wishlistedProducts.length} saved keepsakes to your bag! 🎁`);
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Saved Wishlist' }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
            Personal Registry
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark">
            Saved <span className="italic font-normal text-brand-plum font-serif">Keepsakes</span>
          </h1>
        </div>

        {wishlistedProducts.length > 0 && (
          <AnimatedAddToCartButton
            onAdd={handleAddAllToCart}
            label={`Move All to Bag (${wishlistedProducts.length})`}
            className="px-6 py-3 w-fit"
          />
        )}
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-white/80 my-12 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-6">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-3xl font-light text-brand-dark mb-3">
            Your Wishlist Is Clean
          </h3>
          <p className="text-xs text-brand-gray leading-relaxed mb-8 max-w-sm mx-auto">
            Save your favorite personalized frames, everlasting crochet stems, or BTS Borahae keepsakes by clicking the heart on any card.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full cursor-pointer hover:brightness-110 shadow-md"
          >
            Explore Gifting Catalog
          </button>
        </div>
      )}
    </div>
  );
};
