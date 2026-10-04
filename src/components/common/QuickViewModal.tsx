import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, ShoppingBag, Heart, Check, Sparkles } from 'lucide-react';
import { AnimatedAddToCartButton } from './AnimatedAddToCartButton';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [recipientName, setRecipientName] = useState('');

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);
  const isBts = product.category === 'bts';

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, {
      recipientName: recipientName.trim() || undefined,
    });
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border overflow-hidden max-h-[90vh] overflow-y-auto ${
          isBts
            ? 'liquid-glass-purple-army border-purple-400/50 text-white'
            : 'liquid-glass-card bg-brand-cream/95 border-white/90 text-brand-dark'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-current flex items-center justify-center hover:bg-white/40 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Product Gallery View */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-blush/30 p-4 flex items-center justify-center border border-white/60">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
            <span
              className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                isBts ? 'bg-purple-600 text-white' : 'bg-brand-plum text-white'
              }`}
            >
              {product.categoryLabel}
            </span>
          </div>

          {/* Details & Configurator */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-semibold">{product.rating}</span>
                <span className="text-xs opacity-60">({product.reviewCount} reviews)</span>
                <span className="text-xs opacity-40">·</span>
                <span className="text-xs font-medium text-brand-rosegold">
                  {product.craftingTime} Crafting
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-light mb-2">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="font-bold font-sans tabular-nums text-[#4A234A]"
                  style={{ fontSize: '1.25rem', color: '#4A234A' }}
                >
                  ₹{product.source === 'woocommerce'
                    ? Math.round(product.price).toLocaleString('en-IN')
                    : Math.round(product.price < 150 ? product.price * 82 : product.price).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through opacity-50 tabular-nums">
                    ₹{product.source === 'woocommerce'
                      ? Math.round(product.originalPrice).toLocaleString('en-IN')
                      : Math.round(product.originalPrice < 150 ? product.originalPrice * 82 : product.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="text-xs leading-relaxed opacity-80 mb-5">
                {product.description}
              </p>

              {/* Options */}
              {product.options &&
                product.options.map((opt) => (
                  <div key={opt.name} className="mb-4">
                    <label className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-90">
                      {opt.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => {
                        const isSelected =
                          selectedOptions[opt.name] === val ||
                          (!selectedOptions[opt.name] && val === opt.values[0]);
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleOptionChange(opt.name, val)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                              isSelected
                                ? isBts
                                  ? 'bg-purple-600 text-white font-semibold'
                                  : 'bg-brand-plum text-white font-semibold shadow-sm'
                                : 'bg-white/50 hover:bg-white/80 border border-current/20'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Customizer Name Preview */}
              {product.customizable && (
                <div className="mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5 opacity-90">
                    Recipient Name / Initials
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sophia"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 border border-current/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-current/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center rounded-full bg-white/50 border border-current/20 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-70"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-70"
                  >
                    +
                  </button>
                </div>

                <AnimatedAddToCartButton
                  onAdd={handleAddToCart}
                  label="ADD TO CART"
                  theme={isBts ? 'purple' : 'plum'}
                  className="flex-1 py-3"
                />

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`w-11 h-11 rounded-full flex items-center justify-center border border-current/20 transition-colors cursor-pointer ${
                    wishlisted ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo('product-details', product.slug);
                }}
                className="w-full text-center text-xs text-brand-rosegold hover:underline font-medium py-1"
              >
                View Full Product Details & Customizer Studio →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
