import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
  Plus,
  Database,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Shield,
  Layers,
} from 'lucide-react';
import {
  getWooCommerceAdminStatus,
  exportMockProductsToWooCommerce,
} from '../services/productService';

export const AccountPage: React.FC = () => {
  const { user, logout, orders, navigateTo, showToast, refreshProducts } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'database' | 'settings'>('orders');

  // WooCommerce Database Dashboard State
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
      <div className="pt-32 pb-24 px-6 text-center max-w-md mx-auto">
        <h2 className="font-serif text-3xl font-light mb-4">Please Sign In</h2>
        <p className="text-xs text-brand-gray mb-6">
          Access your personalized orders, tracking updates, and saved gift addresses.
        </p>
        <button
          onClick={() => navigateTo('login')}
          className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full cursor-pointer hover:brightness-110"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'My Atelier Account' }]} />

      {/* Profile Header Card */}
      <div className="liquid-glass-card rounded-3xl p-8 border border-white/90 shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center font-serif text-2xl font-medium shadow-md border border-brand-rosegold/50">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-light text-brand-dark">
                {user.name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum">
                Atelier Patron
              </span>
            </div>
            <p className="text-xs text-brand-gray mt-0.5">{user.email}</p>
            <span className="text-[10px] text-brand-rosegold tracking-wider block mt-1">
              Member Since: {user.memberSince}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="liquid-glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-gray hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer w-fit border border-brand-plum/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 liquid-glass-card rounded-3xl p-4 border border-white/80 shadow-md space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-dark hover:bg-white/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Keepsakes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-dark hover:bg-white/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => navigateTo('wishlist')}
            className="w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer text-brand-dark hover:bg-white/60"
          >
            <Heart className="w-4 h-4" />
            <span>My Wishlist</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-dark hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4" />
              <span>WooCommerce Catalog</span>
            </div>
            {wcStatus && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'database' ? 'bg-white/20 text-white' : 'bg-brand-plum/10 text-brand-plum'
              }`}>
                {wcStatus.productCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-dark hover:bg-white/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Preferences & Atelier</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-brand-dark">
                Order History & Live Handcrafting Status
              </h2>

              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="liquid-glass-card rounded-3xl p-6 border border-white/80 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-plum/10 gap-3 mb-5">
                      <div>
                        <span className="text-xs font-bold text-brand-plum">
                          Order #{order.id}
                        </span>
                        <span className="text-xs text-brand-gray ml-3">Placed on {order.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900 animate-pulse'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-serif font-bold text-base text-brand-plum tabular-nums">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-blush/40 flex-none border border-white/80 p-0.5">
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
                                Quantity: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              {item.personalization?.recipientName && (
                                <span className="text-[11px] text-brand-plum italic block">
                                  Foil Name: "{item.personalization.recipientName}"
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details */}
                    <div className="pt-4 border-t border-brand-plum/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-brand-gray gap-2">
                      <span>
                        Tracking Number: <strong>{order.trackingNumber || 'Assigned in 24h'}</strong>
                      </span>
                      <span className="font-medium text-brand-plum">
                        Est. Delivery: {order.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="liquid-glass-card rounded-3xl p-10 text-center border border-white/80">
                  <Package className="w-10 h-10 text-brand-rosegold mx-auto mb-3" />
                  <p className="text-xs text-brand-gray mb-4">You have no recorded orders yet.</p>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="liquid-glass-plum text-white text-xs font-semibold uppercase px-6 py-2.5 rounded-full"
                  >
                    Start Gifting
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-light text-brand-dark">
                  Saved Gifting Addresses
                </h2>
                <button className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-plum flex items-center gap-1.5 border border-brand-plum/20">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="liquid-glass-card rounded-3xl p-6 border border-white/80 shadow-md relative"
                  >
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-brand-rosegold text-brand-dark px-2.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-medium text-brand-dark mb-1">
                      {addr.fullName}
                    </h3>
                    <p className="text-xs text-brand-gray leading-relaxed mb-3">
                      {addr.street} <br />
                      {addr.city}, {addr.state} {addr.postalCode} <br />
                      {addr.country}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-brand-plum font-semibold">
                      <button className="hover:underline">Edit</button>
                      <span>·</span>
                      <button className="hover:underline text-red-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WOOCOMMERCE DATABASE OPERATIONS */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-light text-brand-dark">
                    WooCommerce Database Catalog
                  </h2>
                  <p className="text-xs text-brand-gray mt-0.5">
                    Direct integration with your Hostinger WordPress table &bull; Credentials secured server-side
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadWcStatus}
                    disabled={isRefreshingWc}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass-pill text-xs font-semibold text-brand-plum hover:bg-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWc ? 'animate-spin' : ''}`} />
                    <span>Refresh DB Status</span>
                  </button>

                  <button
                    onClick={handleExportToWooCommerce}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-plum text-white text-xs font-semibold hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-brand-blush" />
                    <span>{isExporting ? 'Pushing to WooCommerce...' : 'Push Mock Products to WC'}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="liquid-glass-card rounded-3xl p-6 border border-white/80 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-plum/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-none">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-medium text-brand-dark">
                          {wcStatus?.connected ? 'WooCommerce API Connected' : 'Checking Connection...'}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-xs text-brand-gray">
                        Backend URL: <code className="font-mono text-brand-plum">{wcStatus?.storeUrl || 'https://whitesmoke-wolverine-491981.hostingersite.com'}</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-brand-gray tracking-wider block">
                        Registered Products
                      </span>
                      <span className="font-serif text-2xl font-bold text-brand-plum">
                        {wcStatus?.productCount ?? 0}
                      </span>
                    </div>

                    <a
                      href={`${wcStatus?.storeUrl || 'https://whitesmoke-wolverine-491981.hostingersite.com'}/wp-admin/edit.php?post_type=product`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full liquid-glass-pill text-brand-plum hover:bg-white transition-colors"
                      title="Open WooCommerce Products in WP Admin"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {exportFeedback && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-brand-plum/5 border border-brand-plum/20 text-xs text-brand-plum flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-none text-brand-rosegold" />
                    <span>{exportFeedback}</span>
                  </div>
                )}

                <div className="pt-4 flex items-center gap-2 text-xs text-brand-gray">
                  <Shield className="w-4 h-4 text-emerald-600 flex-none" />
                  <span>
                    WooCommerce Consumer Key and Consumer Secret are secured server-side and never exposed to the client.
                  </span>
                </div>
              </div>

              {/* Products Table */}
              <div className="liquid-glass-card rounded-3xl p-6 border border-white/80 shadow-md">
                <h3 className="font-serif text-lg font-medium text-brand-dark mb-4">
                  Live WooCommerce Products Table
                </h3>

                {wcStatus && wcStatus.products && wcStatus.products.length > 0 ? (
                  <div className="space-y-2.5">
                    {wcStatus.products.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-white/70 border border-brand-plum/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-plum/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-brand-plum/10 text-brand-plum">
                            #{p.id}
                          </span>
                          <div>
                            <span className="font-serif text-sm font-medium text-brand-dark block">
                              {p.name}
                            </span>
                            <span className="text-xs text-brand-gray font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                            {p.status || 'publish'}
                          </span>

                          <span
                            className="font-serif font-bold text-[#4A234A] tracking-tight"
                            style={{ fontSize: '1.25rem', color: '#4A234A' }}
                          >
                            ₹{Math.round(parseFloat(p.price || '0') < 150 ? parseFloat(p.price || '0') * 82 : parseFloat(p.price || '0')).toLocaleString('en-IN')}
                          </span>

                          <a
                            href={`${wcStatus.storeUrl}/wp-admin/post.php?post=${p.id}&action=edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full hover:bg-black/5 text-brand-gray hover:text-brand-plum transition-colors"
                            title="Edit in WP Admin"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-gray">No products found in WooCommerce database table.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 shadow-md space-y-6">
              <h2 className="font-serif text-2xl font-light text-brand-dark">
                Account & Notification Preferences
              </h2>

              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/70 border border-brand-plum/10 cursor-pointer">
                  <div>
                    <span className="font-bold text-brand-dark block">
                      Order Handcrafting Stage Alerts
                    </span>
                    <span className="text-brand-gray">
                      Receive photo verification when ribbon and foil stamping are completed.
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-brand-plum rounded w-4 h-4" />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/70 border border-brand-plum/10 cursor-pointer">
                  <div>
                    <span className="font-bold text-brand-dark block">
                      BTS Borahae Secret Drops
                    </span>
                    <span className="text-brand-gray">
                      Early notification for limited-edition concert & anniversary keepsakes.
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-brand-plum rounded w-4 h-4" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
