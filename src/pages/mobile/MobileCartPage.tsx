import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';

export const MobileCartPage: React.FC = () => {
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
    navigateTo,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Your Presentation Box
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Keepsake Bag
        </h1>
      </div>

      {cart.length > 0 ? (
        <div className="space-y-4">
          {/* Cart items */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl liquid-glass-tier-1 border border-white flex gap-3.5 items-center relative"
            >
              <div
                onClick={() => navigateTo('product-details', item.product.slug)}
                className="w-18 h-18 rounded-xl overflow-hidden bg-[#FFFDFB] p-1.5 flex items-center justify-center border border-[#EADBCE]/40 flex-none cursor-pointer"
              >
                <img src={item.product.images[0]} alt="" className="w-full h-full object-contain object-center" referrerPolicy="no-referrer" />
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <span className="text-[10px] font-semibold text-[#814f65] uppercase tracking-wider block">
                  {item.product.categoryLabel}
                </span>
                <h4
                  onClick={() => navigateTo('product-details', item.product.slug)}
                  className="font-serif text-[15px] font-semibold text-[#241B22] truncate cursor-pointer hover:underline"
                >
                  {item.product.name}
                </h4>

                {item.personalization?.recipientName && (
                  <p className="text-[10px] text-primary-container font-serif italic truncate">
                    "{item.personalization.recipientName}"
                  </p>
                )}

                {item.personalization?.uploadedPhotoName && (
                  <p className="text-[9px] text-emerald-800 font-semibold truncate mt-0.5">
                    📸 Photo: {item.personalization.uploadedPhotoName}
                  </p>
                )}

                {item.personalization?.uploadedFileName && (
                  <p className="text-[9px] text-purple-900 font-semibold truncate mt-0.5">
                    🧶 Pattern: {item.personalization.uploadedFileName}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="font-title-lg text-sm text-primary font-bold tabular-nums">
                    ₹{Math.round(item.price * 82 * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center rounded-full bg-white/80 border border-outline-variant/40 px-1.5 py-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="absolute top-3 right-3 text-outline hover:text-error cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}

          {/* Coupon Code Section */}
          <div className="p-4 rounded-2xl liquid-glass-tier-1 border border-outline-variant/30 mt-4">
            <span className="font-label-sm text-xs font-semibold text-primary block mb-2 uppercase">
              Atelier Voucher
            </span>
            {appliedCoupon ? (
              <div className="flex items-center justify-between text-xs text-secondary-container bg-primary-container p-2.5 rounded-xl">
                <span>Code <strong>{appliedCoupon}</strong> Applied</span>
                <button onClick={removeCoupon} className="font-bold underline cursor-pointer">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="WISH10 or BORAHAE"
                  className="flex-1 px-3 py-2 rounded-full liquid-glass-tier-1 border border-outline-variant/50 text-xs font-headline-sm uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-primary text-white text-xs font-label-md cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Cost Summary Card */}
          <div className="p-4 rounded-2xl liquid-glass-tier-2 border border-white/90 space-y-2 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>Keepsakes Subtotal</span>
              <span className="font-bold text-primary tabular-nums">
                ₹{Math.round(subtotal * 82).toLocaleString('en-IN')}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Voucher Discount</span>
                <span className="font-bold tabular-nums">
                  -₹{Math.round(discount * 82).toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Silk Padded Packaging & Courier</span>
              <span className="font-bold text-primary">
                {shipping === 0 ? 'COMPLIMENTARY' : `₹${Math.round(shipping * 82)}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/30 text-sm font-bold text-primary">
              <span>Total (Incl. Taxes)</span>
              <span className="font-title-lg text-lg text-primary tabular-nums">
                ₹{Math.round(total * 82).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 rounded-full bg-primary-container text-white font-label-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-transform mt-3 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-10 rounded-2xl liquid-glass-tier-1 border border-white text-center my-8">
          <span className="material-symbols-outlined text-[48px] text-secondary-container mb-2">
            shopping_bag
          </span>
          <h3 className="font-headline-sm text-lg text-primary mb-1">Your Bag Is Empty</h3>
          <p className="text-xs text-on-surface-variant mb-5">
            Discover our personalized keepsakes and handcrafted flowers.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-label-md"
          >
            Explore Keepsakes
          </button>
        </div>
      )}
    </div>
  );
};
