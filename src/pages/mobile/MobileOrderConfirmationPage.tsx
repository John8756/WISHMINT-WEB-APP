import React from 'react';
import { useShop } from '../../context/ShopContext';

export const MobileOrderConfirmationPage: React.FC = () => {
  const { latestOrder, orders, navigateTo } = useShop();

  const currentOrder = latestOrder || (orders.length > 0 ? orders[0] : null);

  if (!currentOrder) {
    return (
      <div className="px-gutter pt-16 pb-36 text-on-surface min-h-screen text-center">
        <h2 className="font-headline-sm text-lg text-primary mb-2">No Active Order</h2>
        <p className="text-xs text-on-surface-variant mb-6">
          You have not placed an order yet in this session.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-label-md"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  const orderId = currentOrder.id;
  const total = currentOrder.total;

  return (
    <div className="px-gutter pt-8 pb-40 text-on-surface min-h-screen text-center">
      <div className="w-16 h-16 rounded-full bg-secondary-container/60 text-primary flex items-center justify-center mx-auto mb-4 animate-bounce">
        <span className="material-symbols-outlined text-[32px]">done_all</span>
      </div>

      <span className="font-label-sm text-xs font-semibold uppercase tracking-widest text-secondary block mb-1">
        Order Confirmed • Handcrafting Started
      </span>
      <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">
        Thank You For Gifting
      </h1>
      <p className="text-xs text-on-surface-variant max-w-xs mx-auto mb-6">
        Your bespoke keepsake order has been received by our studio artisans in Pune.
      </p>

      <div className="p-4 rounded-2xl liquid-glass-tier-2 border border-white/90 text-left text-xs space-y-2.5 mb-6">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Order ID</span>
          <span className="font-bold text-primary">#{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Estimated Delivery</span>
          <span className="font-bold text-primary">3–4 Business Days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Total Amount</span>
          <span className="font-bold text-primary tabular-nums">
            ₹{Math.round(total * 82).toLocaleString('en-IN')}
          </span>
        </div>

        {latestOrder && latestOrder.items && latestOrder.items.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/30 space-y-2">
            <span className="font-semibold text-primary block text-[11px]">Bespoke Items:</span>
            {latestOrder.items.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-white/60 text-[10px] space-y-0.5">
                <p className="font-bold text-primary">{item.productName} (x{item.quantity})</p>
                {item.personalization?.uploadedPhotoName && (
                  <p className="text-emerald-800 font-medium">📸 Custom Photo: {item.personalization.uploadedPhotoName}</p>
                )}
                {item.personalization?.uploadedFileName && (
                  <p className="text-purple-900 font-medium">🧶 Custom Pattern: {item.personalization.uploadedFileName}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigateTo('shop')}
        className="w-full py-3.5 rounded-full bg-primary text-white font-label-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-transform cursor-pointer"
      >
        <span>Continue Gifting</span>
        <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
      </button>
    </div>
  );
};
