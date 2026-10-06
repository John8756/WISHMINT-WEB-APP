import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { decodeHtmlEntities } from '../../services/wpService';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';

export const MobileShopPage: React.FC = () => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isWishlisted,
    showToast,
    products,
    productsLoading,
    isLiveWooCommerce,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');

  // Products are dynamically loaded from WooCommerce for the exact selected category
  const filteredProducts = products.filter((p) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const nameMatches = p.name.toLowerCase().includes(q);
      const descMatches = p.shortDescription ? p.shortDescription.toLowerCase().includes(q) : false;
      return nameMatches || descMatches;
    }
    return true;
  });

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const activeCategoryTitle = activeCategoryObj
    ? decodeHtmlEntities(activeCategoryObj.name)
    : 'All Keepsakes';

  // Dynamic category pills fetched directly from WooCommerce
  const dynamicCategories = [
    { id: 'all', label: 'All Catalog' },
    ...categories.map((c) => ({
      id: c.slug,
      label: decodeHtmlEntities(c.name),
    })),
  ];

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          {selectedCategory ? 'Collection Category' : 'Atelier Vault'}
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          {activeCategoryTitle}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto mt-1">
          {activeCategoryObj?.description
            ? activeCategoryObj.description
            : 'Explore our handcrafted repertoire of personalized gifts.'}
        </p>
        {isLiveWooCommerce && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WooCommerce Store Synced</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, sentiment, flower..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/95 border border-[#C9A46C]/40 focus:border-[#4A234A] text-sm font-sans text-[#241B22] placeholder-[#867277] outline-none shadow-xs"
        />
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-[#4A234A]">
          search
        </span>
      </div>

      {/* Dynamic Category Pills */}
      {dynamicCategories.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {dynamicCategories.map((cat) => {
            const isSelected = (selectedCategory || 'all') === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-label-md whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#4A234A] text-white font-semibold shadow-sm'
                    : 'bg-[#FFF5F8] border border-[#E2B7C8] text-[#534247] hover:text-[#4A234A]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Product Cards List / Loading / Empty State */}
      {productsLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#4A234A] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#867277] font-medium">Fetching keepsakes from store...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-5">
          {filteredProducts.map((product) => {
            const wishlisted = isWishlisted(product.id);
            const isBts = product.category === 'bts';
            return (
              <div
                key={product.id}
                className="w-full rounded-2xl p-4 bg-white/95 border border-[#EADBCE] shadow-sm transition-all h-auto flex flex-col justify-between text-[#241B22]"
              >
                {/* 1. Product Image Container (1:1 aspect ratio, full product visible, no extra frame/background) */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#FAF7F2]/60">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-stone-200/60 flex items-center justify-center text-[#814f65] active:scale-90 transition-transform cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-[17px]"
                      style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ba1a1a' } : {}}
                    >
                      {wishlisted ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>

                {/* 2. Product Meta Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#9A7036] truncate">
                        {product.categoryLabel || 'Handmade Keepsake'}
                      </span>
                      {product.isBestseller && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#4A234A] text-white shrink-0">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => navigateTo('product-details', product.slug)}
                      className="font-serif text-lg sm:text-xl font-bold text-[#4A234A] leading-snug cursor-pointer hover:text-[#341534] transition-colors mb-1.5"
                    >
                      {product.name}
                    </h3>
                    <p className="font-body-sm text-xs text-[#534247] line-clamp-2 mb-3 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* 3. Price & Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EADBCE]/60">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span
                        className="font-bold text-[#4A234A] tabular-nums tracking-tight"
                        style={{ fontSize: '1.25rem', color: '#4A234A' }}
                      >
                        ₹{Math.round(product.price < 150 ? product.price * 82 : product.price).toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-[#867277]/80 line-through tabular-nums font-medium">
                          ₹{Math.round(product.originalPrice < 150 ? product.originalPrice * 82 : product.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <AnimatedAddToCartButton
                        onAdd={() => {
                          addToCart(product, 1);
                          showToast(`Added ${product.name} to Bag! 💐`);
                        }}
                        label="Claim"
                        className="px-4 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 space-y-3 liquid-glass-tier-1 rounded-3xl border border-white/80 my-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
          <h3 className="font-headline-sm text-base text-primary font-bold">
            No keepsakes found
          </h3>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            No items currently found in this category.
          </p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-2 text-xs font-semibold text-primary underline cursor-pointer"
          >
            Show all gifts
          </button>
        </div>
      )}
    </div>
  );
};
