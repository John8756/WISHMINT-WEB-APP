import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  getWooCommerceAdminStatus,
  exportMockProductsToWooCommerce,
} from '../../services/productService';

export const MobileAccountPage: React.FC = () => {
  const { user, logout, orders, navigateTo, showToast, refreshProducts } = useShop();

  const [wcStatus, setWcStatus] = useState<{
    connected: boolean;
    storeUrl: string;
    productCount: number;
    products?: any[];
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshingWc, setIsRefreshingWc] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadWcStatus();
  }, []);

  const loadWcStatus = async () => {
    setIsRefreshingWc(true);
    try {
      const status = await getWooCommerceAdminStatus();
      setWcStatus(status);
    } finally {
      setIsRefreshingWc(false);
    }
  };

  const handleExportToWooCommerce = async () => {
    setIsExporting(true);
    setExportFeedback(null);
    try {
      const res = await exportMockProductsToWooCommerce();
      if (res.success) {
        showToast(res.message);
        setExportFeedback(res.message);
        await loadWcStatus();
        await refreshProducts();
      } else {
        showToast(res.message || 'Export error');
        setExportFeedback(res.error || res.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Export failed');
      setExportFeedback(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (!user) {
    return (
      <div className="px-gutter pt-12 pb-32 text-center text-on-surface">
        <h2 className="font-headline-sm text-lg text-primary mb-2">Atelier Account Portal</h2>
        <p className="text-xs text-on-surface-variant mb-6">Sign in to track orders and save gift addresses.</p>
        <button
          onClick={() => navigateTo('login')}
          className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-label-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="px-gutter pt-4 pb-36 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center font-headline-sm text-lg mx-auto mb-2">
          {user.name.charAt(0)}
        </div>
        <h1 className="font-headline-sm text-lg text-primary font-bold">{user.name}</h1>
        <p className="text-xs text-on-surface-variant">{user.email}</p>
        <button
          onClick={logout}
          className="mt-2 text-xs font-label-md text-error hover:underline cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* WooCommerce Database Operations Panel (Clean & Professional) */}
      <div className="p-4 rounded-2xl liquid-glass-tier-1 border border-white mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-xs text-primary block">WooCommerce Database</span>
            <span className="text-[11px] text-on-surface-variant">
              {wcStatus?.connected ? 'Connected to Hostinger DB' : 'Checking status...'}
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-container text-primary font-mono">
            {wcStatus?.productCount ?? 0} Products
          </span>
        </div>

        {exportFeedback && (
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary text-[11px] leading-snug">
            {exportFeedback}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={loadWcStatus}
            disabled={isRefreshingWc}
            className="flex-1 py-2 px-2.5 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold text-center cursor-pointer disabled:opacity-50"
          >
            {isRefreshingWc ? 'Checking...' : 'Refresh Status'}
          </button>
          <button
            onClick={handleExportToWooCommerce}
            disabled={isExporting}
            className="flex-1 py-2 px-2.5 rounded-full bg-primary text-white text-xs font-semibold text-center cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isExporting ? 'Pushing...' : 'Export to WC'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <span className="font-headline-sm text-sm text-primary font-bold">
            Recent Keepsake Orders ({orders.length})
          </span>
        </div>

        {orders.map((ord) => (
          <div key={ord.id} className="p-4 rounded-2xl liquid-glass-tier-1 border border-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-primary">#{ord.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-secondary-container text-primary">
                {ord.status}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Placed on {ord.date}</p>
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20 text-xs">
              <span className="text-secondary">{ord.items.length} items</span>
              <span className="font-bold text-primary tabular-nums">
                ₹{Math.round(ord.total * 82).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
