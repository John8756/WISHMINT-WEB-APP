import React from 'react';
import { useShop } from '../context/ShopContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CheckCircle2, Package, Sparkles, Printer, ArrowRight, Truck } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { latestOrder, orders, navigateTo } = useShop();

  const order = latestOrder || (orders.length > 0 ? orders[0] : null);

  if (!order) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-xl mx-auto text-center min-h-[60vh] flex flex-col justify-center text-brand-dark">
        <h2 className="text-2xl font-serif mb-3">No Active Order Found</h2>
        <p className="text-sm text-brand-gray mb-6">
          You haven't placed an order in this session yet. Explore our handcrafted keepsakes to start gifting.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="btn-primary py-3 px-8 rounded-full text-xs uppercase tracking-widest font-semibold"
        >
          Explore Keepsakes
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Order Confirmed' }]} />

      {/* Confirmation Celebration Card */}
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-14 border border-white/90 shadow-2xl text-center mb-10 relative overflow-hidden">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mb-6 shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
          Order Confirmed & Verified
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark mb-4">
          Thank you for choosing{' '}
          <span className="italic font-normal text-brand-plum font-serif">Wishmint.</span>
        </h1>
        <p className="text-sm text-brand-gray max-w-lg mx-auto leading-relaxed mb-6">
          Your bespoke keepsake order has been received by our studio artisans. We have begun handcrafting your presentation piece.
        </p>

        {/* Quick Order Badge */}
        <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full liquid-glass-pill border border-brand-plum/20 text-xs font-bold text-brand-plum mb-8">
          <span>Order ID: #{order.id}</span>
          <span>·</span>
          <span>Status: {order.status}</span>
        </div>

        {/* Timeline visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left p-6 rounded-2xl bg-white/70 border border-brand-plum/10 text-xs mb-8">
          <div className="p-3">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
              Step 1 · Order Placed
            </span>
            <p className="font-semibold text-brand-dark">{order.date}</p>
            <span className="text-[10px] text-brand-gray">Payment Verified</span>
          </div>
          <div className="p-3 border-t sm:border-t-0 sm:border-l border-brand-plum/10">
            <span className="text-[10px] uppercase font-bold text-brand-plum block mb-1">
              Step 2 · Studio Assembly
            </span>
            <p className="font-semibold text-brand-dark">2–3 Days Handcrafting</p>
            <span className="text-[10px] text-brand-gray">Foil Stamping & Ribbon</span>
          </div>
          <div className="p-3 border-t sm:border-t-0 sm:border-l border-brand-plum/10">
            <span className="text-[10px] uppercase font-bold text-brand-rosegold block mb-1">
              Step 3 · Delivery
            </span>
            <p className="font-semibold text-brand-dark">{order.estimatedDelivery}</p>
            <span className="text-[10px] text-brand-gray">Tracking: {order.trackingNumber}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="text-left border-t border-brand-plum/10 pt-6 mb-8">
          <h3 className="font-serif text-xl font-medium text-brand-plum mb-4">
            Items in This Order
          </h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-brand-plum/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-blush/40 flex-none border border-white/80 p-0.5">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium text-brand-dark">
                      {item.productName}
                    </h4>
                    <span className="text-xs text-brand-gray">
                      Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {item.personalization?.recipientName && (
                      <span className="text-xs text-brand-plum italic block font-serif">
                        Inscription: "{item.personalization.recipientName}"
                      </span>
                    )}
                    {item.personalization?.uploadedPhotoName && (
                      <span className="text-[11px] text-emerald-800 font-medium block">
                        📸 Uploaded Photo: <strong>{item.personalization.uploadedPhotoName}</strong>
                      </span>
                    )}
                    {item.personalization?.uploadedFileName && (
                      <span className="text-[11px] text-purple-900 font-medium block">
                        🧶 Uploaded Pattern: <strong>{item.personalization.uploadedFileName}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-bold text-sm tabular-nums text-brand-plum">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left border-t border-brand-plum/10 pt-6 text-xs text-brand-gray mb-8">
          <div>
            <h4 className="font-bold text-brand-plum uppercase tracking-wider mb-2">
              Shipping Destination
            </h4>
            <p className="font-semibold text-brand-dark">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div>
            <h4 className="font-bold text-brand-plum uppercase tracking-wider mb-2">
              Payment Summary
            </h4>
            <p>
              Method: <strong>{order.paymentMethod}</strong>
            </p>
            <p>
              Subtotal: <strong>${order.subtotal.toFixed(2)}</strong>
            </p>
            {order.discount > 0 && (
              <p className="text-emerald-700">
                Discount: <strong>-${order.discount.toFixed(2)}</strong>
              </p>
            )}
            <p>
              Shipping: <strong>{order.shipping === 0 ? 'Complimentary' : `$${order.shipping.toFixed(2)}`}</strong>
            </p>
            <p className="text-sm font-serif text-brand-plum font-bold mt-1">
              Total Paid: ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => window.print()}
            className="liquid-glass-pill px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-plum hover:bg-white transition-all flex items-center gap-2 cursor-pointer border border-brand-plum/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => navigateTo('account')}
            className="liquid-glass-pill px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-plum hover:bg-white transition-all flex items-center gap-2 cursor-pointer border border-brand-plum/20"
          >
            <span>View Order Status</span>
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className="liquid-glass-plum text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 text-brand-rosegold" />
          </button>
        </div>
      </div>
    </div>
  );
};
