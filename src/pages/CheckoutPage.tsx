import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Gift,
  Tag,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    shipping,
    total,
    appliedCoupon,
    placeOrder,
    navigateTo,
    user,
    showToast,
  } = useShop();

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6 text-center max-w-lg mx-auto">
        <h2 className="font-serif text-3xl font-light mb-4">No Items To Checkout</h2>
        <p className="text-xs text-brand-gray mb-6">
          Your shopping bag is currently empty. Please select a personalized gift to proceed.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full cursor-pointer hover:brightness-110"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.name || '');
  const [street, setStreet] = useState(user?.addresses[0]?.street || '');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState(user?.addresses[0]?.city || '');
  const [state, setState] = useState(user?.addresses[0]?.state || '');
  const [postalCode, setPostalCode] = useState(user?.addresses[0]?.postalCode || '');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'white-glove'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'cod'>('apple-pay');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [giftWrapNote, setGiftWrapNote] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !postalCode) {
      showToast('Please provide your complete name, street, city, and pincode');
      return;
    }
    setIsPlacing(true);

    try {
      await placeOrder({
        fullName,
        street: apartment ? `${street}, ${apartment}` : street,
        city,
        state,
        postalCode,
        country,
        paymentMethod,
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb
        items={[
          { label: 'Shopping Bag', page: 'cart' },
          { label: 'Distraction-Free Checkout' },
        ]}
      />

      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Secured Atelier Checkout</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark">
          Finalize Your <span className="italic font-normal text-brand-plum font-serif">Bespoke Order</span>
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
            <h2 className="font-serif text-xl font-medium text-brand-plum mb-4 flex items-center justify-between">
              <span>1. Contact Information</span>
              <span className="text-xs text-brand-gray font-normal font-sans">
                Order updates & tracking
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                  Phone Number (for courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
            <h2 className="font-serif text-xl font-medium text-brand-plum mb-4">
              2. Recipient Shipping Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Apt / Suite / Floor
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                  Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
            <h2 className="font-serif text-xl font-medium text-brand-plum mb-4">
              3. Delivery Options
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setDeliveryMethod('standard')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-brand-plum bg-brand-plum/5 shadow-sm'
                    : 'border-brand-plum/15 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="accent-brand-plum"
                  />
                  <div>
                    <span className="font-bold text-xs text-brand-dark block">
                      Standard Handcrafted Courier (3–5 Business Days)
                    </span>
                    <span className="text-[11px] text-brand-gray">
                      Assembled with care, padded protective gift box
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-plum">
                  {subtotal >= 75 ? 'FREE' : '$8.50'}
                </span>
              </label>

              <label
                onClick={() => setDeliveryMethod('express')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-brand-plum bg-brand-plum/5 shadow-sm'
                    : 'border-brand-plum/15 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="accent-brand-plum"
                  />
                  <div>
                    <span className="font-bold text-xs text-brand-dark block">
                      Priority Atelier Rush & Express (1–2 Days)
                    </span>
                    <span className="text-[11px] text-brand-gray">
                      Front-of-queue handcrafting, air courier
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-plum">$14.00</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
            <h2 className="font-serif text-xl font-medium text-brand-plum mb-4">
              4. Payment Method
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'apple-pay'
                    ? 'border-brand-plum bg-brand-plum text-white shadow-md'
                    : 'border-brand-plum/20 bg-white/70 hover:bg-white text-brand-dark'
                }`}
              >
                <span> Pay / G-Pay</span>
                <span className="text-[10px] opacity-70">1-Touch Express</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'border-brand-plum bg-brand-plum text-white shadow-md'
                    : 'border-brand-plum/20 bg-white/70 hover:bg-white text-brand-dark'
                }`}
              >
                <span>Credit Card</span>
                <span className="text-[10px] opacity-70">Visa, MC, Amex</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'cod'
                    ? 'border-brand-plum bg-brand-plum text-white shadow-md'
                    : 'border-brand-plum/20 bg-white/70 hover:bg-white text-brand-dark'
                }`}
              >
                <span>Cash on Delivery</span>
                <span className="text-[10px] opacity-70">Pay on Handover</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 rounded-2xl bg-white/70 border border-brand-plum/15">
                <div>
                  <label className="text-[11px] font-bold uppercase text-brand-dark block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-brand-dark block mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-brand-dark block mb-1">
                      CVC Code
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl sticky top-24">
          <h2 className="font-serif text-2xl font-light text-brand-dark mb-4">
            Items in Order ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h2>

          {/* Compact items list */}
          <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-brand-plum/10">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-blush/40 flex-none border border-white/80 p-0.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif font-medium text-brand-dark line-clamp-1">
                    {item.product.name}
                  </h4>
                  <span className="text-[10px] text-brand-gray block">
                    Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  {item.personalization?.recipientName && (
                    <span className="text-[10px] text-brand-plum italic block line-clamp-1">
                      "{item.personalization.recipientName}"
                    </span>
                  )}
                  {item.personalization?.uploadedPhotoName && (
                    <span className="text-[9px] text-emerald-800 font-medium block truncate">
                      📸 Photo: {item.personalization.uploadedPhotoName}
                    </span>
                  )}
                  {item.personalization?.uploadedFileName && (
                    <span className="text-[9px] text-purple-900 font-medium block truncate">
                      🧶 Pattern: {item.personalization.uploadedFileName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-2.5 text-xs text-brand-gray mb-6 pb-6 border-b border-brand-plum/10">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-dark tabular-nums">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700 font-semibold">
                <span>Promotional Discount</span>
                <span className="tabular-nums">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Packaging & Courier</span>
              <span className="font-semibold text-brand-dark tabular-nums">
                {shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-brand-plum block">
                Total Due
              </span>
              <span className="text-[10px] text-brand-gray">All taxes included</span>
            </div>
            <span className="font-serif text-3xl font-light text-brand-plum tabular-nums">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isPlacing}
            className="w-full py-4 rounded-full liquid-glass-plum text-white text-xs font-semibold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isPlacing ? (
              <span>Handcrafting Your Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4 text-brand-rosegold" />
              </>
            )}
          </button>

          <p className="text-[11px] text-brand-gray text-center mt-3 leading-relaxed">
            By placing your order, you agree to WISHMINT's Terms of Atelier Service & Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
};
