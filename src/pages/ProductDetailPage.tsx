import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { RecentlyViewedSection } from '../components/common/RecentlyViewedSection';
import { AnimatedAddToCartButton } from '../components/common/AnimatedAddToCartButton';
import { getProductBySlugOrId } from '../services/productService';
import { addRecentlyViewed } from '../services/recentlyViewedService';
import { Product } from '../types';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Minus,
  ArrowRight,
  Share2,
  RefreshCw,
  Package,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    currentProductSlug,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    showToast,
    products,
  } = useShop();

  const [product, setProduct] = useState<Product | null>(() => {
    return (products || PRODUCTS).find((p) => p.slug === currentProductSlug) || null;
  });
  const [loading, setLoading] = useState<boolean>(!product);
  const [isLiveWc, setIsLiveWc] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Personalization fields
  const [recipientName, setRecipientName] = useState('Sophia & Julian');
  const [anniversaryDate, setAnniversaryDate] = useState('October 14, 2024');
  const [spotifySong, setSpotifySong] = useState('Lover — Taylor Swift (or BTS Mikrokosmos)');
  const [customNote, setCustomNote] = useState('Made for moments they will never forget.');
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');

  // Dynamic Product Fetching from WooCommerce API
  useEffect(() => {
    if (!currentProductSlug) return;
    let isMounted = true;

    // Check if product is already cached in memory
    const existing = (products || PRODUCTS).find(
      (p) => p.slug === currentProductSlug || p.id === currentProductSlug
    );
    if (existing) {
      setProduct(existing);
      setIsLiveWc(existing.source === 'woocommerce');
    } else {
      setLoading(true);
    }

    getProductBySlugOrId(currentProductSlug)
      .then((res) => {
        if (!isMounted) return;
        if (res.product) {
          setProduct(res.product);
          setIsLiveWc(res.isLiveWooCommerce);
          setError(null);
          setActiveImageIndex(0);

          // Initialize options if available
          if (res.product.options && res.product.options.length > 0) {
            const initial: Record<string, string> = {};
            res.product.options.forEach((opt) => {
              initial[opt.name] = opt.values[0];
            });
            setSelectedOptions(initial);
          }
        } else if (!existing) {
          setError('We could not find the requested product in the atelier.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to fetch product details:', err);
        if (!existing) {
          setError('Unable to load product information at this moment.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentProductSlug, products]);

  // Track product in localStorage recently viewed list
  useEffect(() => {
    if (product && product.id) {
      addRecentlyViewed(product);
    }
  }, [product?.id, product?.slug]);

  // Loading Skeleton State
  if (loading && !product) {
    return (
      <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="h-6 w-48 bg-brand-plum/10 rounded-full animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7 aspect-square rounded-3xl bg-brand-plum/5 border border-white/80 animate-pulse p-8 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-brand-plum/40 animate-spin mb-3" />
            <span className="text-xs uppercase font-bold tracking-widest text-brand-plum/60">
              Fetching Product from WooCommerce...
            </span>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 w-28 bg-brand-plum/10 rounded-full animate-pulse" />
            <div className="h-8 w-3/4 bg-brand-plum/10 rounded-xl animate-pulse" />
            <div className="h-6 w-32 bg-brand-plum/15 rounded-lg animate-pulse" />
            <div className="h-24 w-full bg-brand-plum/5 rounded-2xl animate-pulse" />
            <div className="h-12 w-full bg-brand-plum/10 rounded-full animate-pulse mt-6" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-brand-plum/40 mb-4" />
        <h2 className="font-serif text-3xl text-brand-dark mb-2">Product Not Found</h2>
        <p className="text-sm text-brand-gray mb-6">
          {error || "The keepsake you are looking for is currently unavailable in our store."}
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full cursor-pointer hover:brightness-110 shadow-md"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const isBts = product.category === 'bts';

  // Uniform INR Currency Calculations
  const displayPrice =
    product.source === 'woocommerce'
      ? Math.round(product.price)
      : Math.round(product.price * 82);

  const displayOriginalPrice = product.originalPrice
    ? product.source === 'woocommerce'
      ? Math.round(product.originalPrice)
      : Math.round(product.originalPrice * 82)
    : null;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, {
      recipientName: recipientName.trim() || undefined,
      anniversaryDate: anniversaryDate.trim() || undefined,
      spotifySong: spotifySong.trim() || undefined,
      customNote: customNote.trim() || undefined,
    });
    showToast(`Added ${product.name} to your cart! 🎁`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOptions, {
      recipientName: recipientName.trim() || undefined,
      anniversaryDate: anniversaryDate.trim() || undefined,
      spotifySong: spotifySong.trim() || undefined,
      customNote: customNote.trim() || undefined,
    });
    navigateTo('checkout');
  };

  const relatedProducts = (products || PRODUCTS)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'];

  const productDetails =
    product.details && product.details.length > 0
      ? product.details
      : [
          'Handcrafted with archival keepsake materials & museum-quality finish',
          'Tabletop and wall-mountable heirloom presentation',
          'Includes WISHMINT wax-sealed authenticity certificate',
          'Curated in luxury signature gift box packaging',
        ];

  const productReviews =
    product.reviews && product.reviews.length > 0
      ? product.reviews
      : [
          {
            id: 'rev-default-1',
            author: 'Aanya Sen',
            rating: 5,
            date: 'September 2026',
            title: 'Exquisite attention to detail',
            comment:
              'The texture, packaging, and personal craftsmanship surpassed my expectations. Beautiful gift.',
            verified: true,
            occasion: 'Anniversary Gift',
          },
        ];

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Shop Catalog', page: 'shop' },
          {
            label: product.categoryLabel || 'Handmade',
            page:
              product.category === 'bts'
                ? 'bts'
                : product.category === 'handmade'
                ? 'handmade'
                : 'couples',
          },
          { label: product.name },
        ]}
      />

      {/* Main PDP Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20 items-start">
        {/* Left: Interactive Larger Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4 sticky top-24">
          {/* Main Large Visual */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden liquid-glass-card border border-white/90 shadow-2xl p-4 flex items-center justify-center bg-gradient-to-tr from-pink-50/50 via-white to-amber-50/50 group">
            <img
              src={productImages[activeImageIndex] || productImages[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Save to Wishlist"
              className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center liquid-glass-pill shadow-md transition-colors cursor-pointer z-10 ${
                wishlisted ? 'text-red-500' : 'text-brand-plum hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* In-Stock or Sale Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm ${
                  isBts ? 'bg-purple-600 text-white' : 'bg-brand-plum text-white'
                }`}
              >
                {product.categoryLabel || 'Atelier'}
              </span>
              {product.onSale && (
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-600 text-white shadow-sm">
                  Sale
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails row */}
          {productImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer flex-none p-1 bg-white ${
                    activeImageIndex === idx
                      ? 'border-brand-plum shadow-md scale-105'
                      : 'border-white/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Value trust bar under gallery */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-plum/10 text-center text-[11px] text-brand-gray">
            <div className="flex flex-col items-center gap-1 p-2">
              <Truck className="w-4 h-4 text-brand-plum" />
              <span className="font-semibold text-brand-dark">Handcrafted 1–2 Days</span>
              <span className="text-[10px]">Express Tracked Post</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <ShieldCheck className="w-4 h-4 text-brand-plum" />
              <span className="font-semibold text-brand-dark">Damage-Free Guarantee</span>
              <span className="text-[10px]">Free Safe Replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <RotateCcw className="w-4 h-4 text-brand-plum" />
              <span className="font-semibold text-brand-dark">Gift-Ready Box</span>
              <span className="text-[10px]">Silk Ribbon & Seal</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Stock Status & Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-rosegold">
                  {product.categoryLabel}
                </span>
                {isLiveWc && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live WooCommerce Sync</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-brand-dark font-bold tabular-nums">{product.rating}</span>
                <span className="text-brand-gray font-normal">({product.reviewCount} verified)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-dark leading-tight mb-3">
              {product.name}
            </h1>

            {/* Stock Status Badge */}
            <div className="mb-4">
              {product.inStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock & Ready for Customization</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Currently Out of Stock</span>
                </div>
              )}
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-6 pb-5 border-b border-brand-plum/10">
              <span className="text-3xl font-bold font-sans tabular-nums text-brand-plum">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                <>
                  <span className="text-base line-through text-brand-gray/60 tabular-nums">
                    ₹{displayOriginalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Save ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN')} (
                    {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* Full Narrative Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-plum mb-2">
                About this Keepsake
              </h4>
              <p className="text-sm text-brand-gray leading-relaxed font-normal whitespace-pre-line">
                {product.description || product.shortDescription}
              </p>
            </div>

            {/* Dynamic Product Options */}
            {product.options && product.options.length > 0 &&
              product.options.map((opt) => (
                <div key={opt.name} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-plum">
                      {opt.name}
                    </span>
                    <span className="text-xs text-brand-gray font-medium">
                      {selectedOptions[opt.name] || opt.values[0]}
                    </span>
                  </div>
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
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'liquid-glass-plum text-white shadow-md'
                              : 'liquid-glass-pill text-brand-dark hover:bg-white border border-brand-plum/20'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Personalization Studio */}
            {product.customizable && (
              <div className="my-6 p-5 rounded-2xl liquid-glass-card border border-brand-rosegold/50 bg-brand-cream/80 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-brand-rosegold" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-plum">
                    Personalization Studio (Included)
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-brand-gray block mb-1">
                      Recipient Name(s) or Monogram Initial
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Eleanor & Marcus"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-rosegold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-brand-gray block mb-1">
                      Anniversary Date / Milestone Sentiment
                    </label>
                    <input
                      type="text"
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      placeholder="e.g. October 14, 2024"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-rosegold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-brand-gray block mb-1">
                      Custom Gift Message / Song Detail
                    </label>
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g. Made for moments we will never forget."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-rosegold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart Action */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center rounded-full liquid-glass-pill border border-brand-plum/20 p-1 flex-none shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center font-bold text-brand-plum hover:opacity-70 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold tabular-nums text-brand-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center font-bold text-brand-plum hover:opacity-70 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <AnimatedAddToCartButton
                  onAdd={handleAddToCart}
                  disabled={!product.inStock}
                  label="ADD TO CART"
                  showPrice={`₹${(displayPrice * quantity).toLocaleString('en-IN')}`}
                  className="flex-1 py-3.5"
                />
              </div>

              {/* Buy Now Instant Checkout */}
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full py-3.5 rounded-full bg-brand-rosegold hover:brightness-110 text-brand-dark text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Buy Now with Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details, Specs, Shipping & Reviews Tabs */}
      <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 shadow-lg mb-20">
        <div className="flex items-center gap-3 border-b border-brand-plum/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'liquid-glass-plum text-white'
                : 'liquid-glass-pill text-brand-gray hover:text-brand-plum'
            }`}
          >
            Product Craftsmanship & Specs
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'shipping'
                ? 'liquid-glass-plum text-white'
                : 'liquid-glass-pill text-brand-gray hover:text-brand-plum'
            }`}
          >
            Shipping & Dispatch
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'liquid-glass-plum text-white'
                : 'liquid-glass-pill text-brand-gray hover:text-brand-plum'
            }`}
          >
            Verified Customer Stories ({productReviews.length})
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h4 className="font-serif text-xl font-medium text-brand-plum mb-3">
                Material Specifications
              </h4>
              <ul className="space-y-2.5 text-xs text-brand-gray">
                {productDetails.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-brand-plum flex-none mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-xl font-medium text-brand-plum mb-3">
                The Gifting Presentation
              </h4>
              <p className="text-xs text-brand-gray leading-relaxed mb-4">
                Every WISHMINT order is treated as a presentation piece. Packed inside a sturdy custom rigid box, nestled in protective velvet shredding, and sealed with a hand-tied double satin ribbon bow and botanical wax seal. No pricing tags or invoices are included inside the recipient package.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Shipping */}
        {activeTab === 'shipping' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-brand-gray">
            <div className="p-4 rounded-2xl bg-white/60 border border-brand-plum/10">
              <h5 className="font-bold text-brand-plum uppercase tracking-wider mb-2">
                1. Handcrafting Window
              </h5>
              <p className="leading-relaxed">
                Because this item is assembled with custom details and artisan touches, crafting takes <strong>{product.craftingTime || '1–2 Days'}</strong> before dispatch.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 border border-brand-plum/10">
              <h5 className="font-bold text-brand-plum uppercase tracking-wider mb-2">
                2. Shipping & Tracking
              </h5>
              <p className="leading-relaxed">
                Express tracked dispatch across India. Direct SMS and WhatsApp notification with real-time tracking link once dispatched.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 border border-brand-plum/10">
              <h5 className="font-bold text-brand-plum uppercase tracking-wider mb-2">
                3. Arrival Guarantee
              </h5>
              <p className="leading-relaxed">
                If your gift arrives damaged during transit, our atelier dispatches a complimentary priority replacement immediately.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-plum/10 gap-4">
              <div>
                <span className="font-serif text-3xl font-light text-brand-plum mr-3">
                  {product.rating} out of 5
                </span>
                <span className="text-xs text-brand-gray">Based on {product.reviewCount} customer stories</span>
              </div>
              <button
                onClick={() => showToast('Review modal opened — thank you for sharing your love story! ✨')}
                className="liquid-glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-plum border border-brand-rosegold/50 hover:bg-white cursor-pointer w-fit"
              >
                Write A Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productReviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-white/70 border border-brand-plum/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-medium text-sm text-brand-dark">
                      {rev.author}
                    </span>
                    <span className="text-[10px] text-brand-gray">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    {rev.verified && (
                      <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-brand-plum mb-1">{rev.title}</h5>
                  <p className="text-xs text-brand-gray leading-relaxed mb-3">"{rev.comment}"</p>
                  {rev.occasion && (
                    <span className="text-[10px] uppercase tracking-wider text-brand-rosegold font-semibold block">
                      Occasion: {rev.occasion}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Recommendations */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-rosegold block mb-1">
                Curated Suggestions
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-dark font-light">
                Complete Your Gifting Suite
              </h3>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-brand-plum hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Products History Section */}
      <RecentlyViewedSection currentProductId={product?.id} />
    </div>
  );
};
