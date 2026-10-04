import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Heart,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  Camera,
  Scissors,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    navigateTo,
    clearCart,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handleMoveToWishlist = (productId: string, cartItemId: string) => {
    toggleWishlist(productId);
    removeFromCart(cartItemId);
  };

  const freeShippingThreshold = 75.0;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <Breadcrumb items={[{ label: 'Shopping Bag' }]} />

      <div className="mb-10 text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
          Your Presentation Box
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark">
          Shopping <span className="italic font-normal text-brand-plum font-serif">Bag</span>
        </h1>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress notification banner */}
            <div className="p-4 rounded-2xl liquid-glass-card border border-brand-rosegold/40 bg-brand-cream/80 shadow-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-brand-plum flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-rosegold" />
                  {amountNeededForFreeShipping === 0
                    ? '🎉 You have qualified for complimentary bespoke delivery!'
                    : `Add $${amountNeededForFreeShipping.toFixed(2)} more for complimentary delivery`}
                </span>
                <span className="font-bold text-brand-dark tabular-nums">
                  ${subtotal.toFixed(2)} / ${freeShippingThreshold}
                </span>
              </div>
              <div className="w-full h-1.5 bg-brand-plum/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-rosegold transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* List of items */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="liquid-glass-card rounded-3xl p-5 sm:p-6 border border-white/80 shadow-md flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Product Media */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div
                    onClick={() => navigateTo('product-details', item.product.slug)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-brand-blush/40 flex-none border border-white/80 cursor-pointer shadow-sm p-1"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-rosegold block mb-0.5">
                      {item.product.categoryLabel}
                    </span>
                    <h3
                      onClick={() => navigateTo('product-details', item.product.slug)}
                      className="font-serif text-base sm:text-lg font-medium text-brand-dark hover:text-brand-plum transition-colors cursor-pointer"
                    >
                      {item.product.name}
                    </h3>

                    {/* Selected Options summary */}
                    {item.selectedOptions && (
                      <div className="text-[11px] text-brand-gray mt-1 space-y-0.5">
                        {Object.entries(item.selectedOptions).map(([key, val]) => (
                          <div key={key}>
                            <span className="opacity-70">{key}:</span> <strong>{val}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Personalization snippet */}
                    {item.personalization?.recipientName && (
                      <div className="text-[11px] text-brand-plum mt-1 font-serif italic">
                        Foil Inscription: "{item.personalization.recipientName}"
                      </div>
                    )}

                    {/* Uploaded File / Photo Display */}
                    {(item.personalization?.uploadedPhoto || item.personalization?.uploadedPhotoName) && (
                      <div className="mt-2 p-2 rounded-xl bg-brand-cream/80 border border-brand-plum/15 flex items-center gap-2.5 max-w-sm">
                        {item.personalization.uploadedPhoto ? (
                          <img
                            src={item.personalization.uploadedPhoto}
                            alt="Uploaded Custom Photo"
                            className="w-10 h-10 rounded-lg object-cover border border-white shadow-xs flex-none"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-brand-plum/10 text-brand-plum flex items-center justify-center flex-none">
                            <Camera className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-brand-dark block truncate">
                            📸 {item.personalization.uploadedPhotoName || 'Custom Photograph'}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            File attached for custom frame crafting
                          </span>
                        </div>
                      </div>
                    )}

                    {(item.personalization?.uploadedFile || item.personalization?.uploadedFileName) && (
                      <div className="mt-2 p-2 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center gap-2.5 max-w-sm">
                        {item.personalization.uploadedFile?.startsWith('data:image') ? (
                          <img
                            src={item.personalization.uploadedFile}
                            alt="Uploaded Wool Art Reference"
                            className="w-10 h-10 rounded-lg object-cover border border-white shadow-xs flex-none"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center flex-none">
                            <Scissors className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-purple-950 block truncate">
                            🧶 {item.personalization.uploadedFileName || 'Wool Art Reference'}
                          </span>
                          <span className="text-[10px] text-purple-700 font-semibold block">
                            Idea / pattern attached for artisans
                          </span>
                        </div>
                      </div>
                    )}

                    {item.personalization?.customNote && (
                      <div className="text-[10px] text-brand-gray mt-1 line-clamp-1">
                        Note: {item.personalization.customNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stepper, Subtotal & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-brand-plum/10">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-full bg-white/80 border border-brand-plum/20 px-2 py-1 shadow-inner">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 flex items-center justify-center font-bold text-brand-plum hover:opacity-70 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold tabular-nums text-brand-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-7 h-7 flex items-center justify-center font-bold text-brand-plum hover:opacity-70 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="text-base font-bold font-sans tabular-nums text-brand-plum block">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-brand-gray tabular-nums">
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveToWishlist(item.productId, item.id)}
                      title="Move to Wishlist"
                      className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-brand-gray hover:text-red-500 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Remove Item"
                      className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-brand-gray hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs text-brand-plum font-semibold uppercase tracking-wider hover:text-brand-rosegold cursor-pointer"
              >
                ← Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-xs text-brand-gray hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl sticky top-24">
            <h2 className="font-serif text-2xl font-light text-brand-dark mb-6">
              Order Summary
            </h2>

            {/* Coupon input */}
            <div className="mb-6 pb-6 border-b border-brand-plum/10">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-plum block mb-2">
                Atelier Promo Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      Code <strong>{appliedCoupon}</strong> active
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WISH10 or BORAHAE"
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/90 border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-rosegold uppercase"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full liquid-glass-plum text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <span className="text-[11px] text-red-600 mt-1.5 block">{couponError}</span>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-brand-gray mb-6 pb-6 border-b border-brand-plum/10">
              <div className="flex items-center justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-brand-dark tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({appliedCoupon})</span>
                  <span className="tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Bespoke Packaging & Courier</span>
                <span className="font-semibold text-brand-dark tabular-nums">
                  {shipping === 0 ? (
                    <strong className="text-emerald-700">COMPLIMENTARY</strong>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-plum block">
                  Total (Taxes Included)
                </span>
                <span className="text-[11px] text-brand-gray">Ready to dispatch</span>
              </div>
              <span className="font-serif text-3xl font-light text-brand-plum tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 rounded-full liquid-glass-plum text-white text-xs font-semibold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer mb-3"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-brand-rosegold" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-brand-gray text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-brand-rosegold" />
              <span>Encrypted Checkout · Atelier Guarantee</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="liquid-glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-white/80 my-8 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-blush/60 flex items-center justify-center text-brand-plum mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-3xl font-light text-brand-dark mb-3">
            Your Presentation Box Is Empty
          </h3>
          <p className="text-xs text-brand-gray leading-relaxed mb-8 max-w-sm mx-auto">
            You haven’t added any personalized keepsakes or forever crochet stems yet. Discover our curated artisan collections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full cursor-pointer hover:brightness-110 shadow-md"
            >
              Explore All Gifts
            </button>
            <button
              onClick={() => navigateTo('handmade')}
              className="w-full sm:w-auto liquid-glass-pill text-brand-plum text-xs font-semibold uppercase tracking-wider px-7 py-3.5 rounded-full cursor-pointer hover:bg-white border border-brand-rosegold/40"
            >
              Crochet Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
