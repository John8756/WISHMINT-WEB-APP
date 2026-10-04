import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';

export const MobileCheckoutPage: React.FC = () => {
  const { cart, subtotal, discount, shipping, total, placeOrder, navigateTo, user, showToast } = useShop();

  const [fullName, setFullName] = useState(user?.name || '');
  const [street, setStreet] = useState(user?.addresses[0]?.street || '');
  const [city, setCity] = useState(user?.addresses[0]?.city || '');
  const [state, setState] = useState(user?.addresses[0]?.state || '');
  const [postalCode, setPostalCode] = useState(user?.addresses[0]?.postalCode || '');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'cod'>('apple-pay');
  const [isPlacing, setIsPlacing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="px-gutter pt-12 pb-32 text-center text-on-surface">
        <h2 className="font-headline-sm text-lg mb-2">No Items in Bag</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-label-md"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !postalCode) {
      showToast('Please provide your name, street, city, and pincode');
      return;
    }
    setIsPlacing(true);
    try {
      await placeOrder({
        fullName,
        street,
        city,
        state,
        postalCode,
        country: 'India',
        paymentMethod: paymentMethod === 'apple-pay' ? 'apple-pay' : paymentMethod === 'cod' ? 'cod' : 'card',
      });
    } catch (err: any) {
      showToast(err.message || 'Order could not be placed');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          256-Bit SSL Atelier Protection
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Bespoke Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        {/* Recipient Details */}
        <div className="p-4 rounded-2xl liquid-glass-tier-1 border border-white space-y-3">
          <span className="font-label-sm text-xs font-semibold text-primary block uppercase">
            1. Recipient Delivery Coordinates
          </span>
          <div>
            <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm text-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">Address *</label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm text-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm text-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">Postal Code *</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm text-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm text-primary"
            />
          </div>
        </div>

        {/* Payment selector */}
        <div className="p-4 rounded-2xl liquid-glass-tier-1 border border-white space-y-2">
          <span className="font-label-sm text-xs font-semibold text-primary block uppercase mb-2">
            2. Payment Method
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setPaymentMethod('apple-pay')}
              className={`p-2.5 rounded-xl border font-label-md cursor-pointer transition-all ${
                paymentMethod === 'apple-pay'
                  ? 'border-primary bg-primary-container text-white font-bold'
                  : 'liquid-glass-tier-1 text-primary'
              }`}
            >
              UPI / Apple Pay
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-xl border font-label-md cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? 'border-primary bg-primary-container text-white font-bold'
                  : 'liquid-glass-tier-1 text-primary'
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-2.5 rounded-xl border font-label-md cursor-pointer transition-all ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary-container text-white font-bold'
                  : 'liquid-glass-tier-1 text-primary'
              }`}
            >
              COD
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 rounded-2xl liquid-glass-tier-2 border border-white/90 text-xs space-y-2.5">
          <span className="font-label-sm text-xs font-semibold text-primary block uppercase border-b border-outline-variant/30 pb-1.5">
            3. Order Review ({cart.length} items)
          </span>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5 py-1 border-b border-outline-variant/20 last:border-none">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-9 h-9 rounded-lg object-cover flex-none bg-surface-container"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-headline-sm text-[11px] text-primary truncate font-semibold">
                    {item.product.name} (x{item.quantity})
                  </p>
                  {item.personalization?.uploadedPhotoName && (
                    <p className="text-[9px] text-emerald-800 font-medium truncate">
                      📸 Photo: {item.personalization.uploadedPhotoName}
                    </p>
                  )}
                  {item.personalization?.uploadedFileName && (
                    <p className="text-[9px] text-purple-900 font-medium truncate">
                      🧶 Pattern: {item.personalization.uploadedFileName}
                    </p>
                  )}
                </div>
                <span className="font-bold tabular-nums text-primary text-[11px]">
                  ₹{Math.round(item.price * 82 * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-1 border-t border-outline-variant/30">
            <span>Subtotal</span>
            <span className="font-bold tabular-nums">₹{Math.round(subtotal * 82).toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-secondary">
              <span>Discount</span>
              <span className="font-bold tabular-nums">-₹{Math.round(discount * 82).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Packaging & Courier</span>
            <span className="font-bold">{shipping === 0 ? 'FREE' : `₹${Math.round(shipping * 82)}`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-outline-variant/30">
            <span>Total Payable</span>
            <span className="font-title-lg text-lg tabular-nums">
              ₹{Math.round(total * 82).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPlacing}
            className="w-full py-3.5 rounded-full bg-primary text-white font-label-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-xl active:scale-95 transition-transform mt-3 cursor-pointer disabled:opacity-50"
          >
            {isPlacing ? (
              <span>Handcrafting Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
