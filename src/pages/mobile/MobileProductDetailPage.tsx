import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { RecentlyViewedSection } from '../../components/common/RecentlyViewedSection';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';
import { getProductBySlugOrId } from '../../services/productService';
import { addRecentlyViewed } from '../../services/recentlyViewedService';
import { Product } from '../../types';

export const MobileProductDetailPage: React.FC = () => {
  const {
    currentProductSlug,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    navigateBack,
    showToast,
    products,
  } = useShop();

  const [product, setProduct] = useState<Product | null>(() => {
    return (products || PRODUCTS).find((p) => p.slug === currentProductSlug) || null;
  });
  const [loading, setLoading] = useState<boolean>(!product);
  const [isLiveWc, setIsLiveWc] = useState<boolean>(false);

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [recipientName, setRecipientName] = useState('Sophia & Julian');
  const [anniversaryDate, setAnniversaryDate] = useState('October 14, 2024');
  const [spotifySong, setSpotifySong] = useState('Mikrokosmos');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentProductSlug) return;
    let isMounted = true;

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
          setActiveImgIdx(0);

          if (res.product.options && res.product.options.length > 0) {
            const init: Record<string, string> = {};
            res.product.options.forEach((opt) => {
              init[opt.name] = opt.values[0];
            });
            setSelectedOptions(init);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch mobile product detail:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentProductSlug, products]);

  // Track product in localStorage browsing history
  useEffect(() => {
    if (product && product.id) {
      addRecentlyViewed(product);
    }
  }, [product?.id, product?.slug]);

  if (loading && !product) {
    return (
      <div className="px-gutter pt-6 pb-36 text-on-surface min-h-screen">
        <div className="h-6 w-32 bg-primary-container/20 rounded-full animate-pulse mb-4" />
        <div className="w-full h-80 rounded-2xl liquid-glass-tier-2 animate-pulse mb-6 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-primary animate-spin mb-2">
            progress_activity
          </span>
          <span className="text-xs font-label-md text-secondary">
            Loading Product Details...
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-5 w-2/3 bg-primary-container/20 rounded-md animate-pulse" />
          <div className="h-7 w-1/3 bg-primary-container/30 rounded-md animate-pulse" />
          <div className="h-20 w-full bg-primary-container/10 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-gutter pt-16 pb-36 text-center">
        <span className="material-symbols-outlined text-[48px] text-secondary mb-3">
          inventory_2
        </span>
        <h2 className="font-headline-lg-mobile text-primary mb-2">Product Not Found</h2>
        <p className="text-xs text-on-surface-variant mb-6">
          This keepsake might have been moved or is temporarily out of stock.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 rounded-full bg-primary text-white text-xs font-label-md uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Unified INR calculation
  const displayPrice =
    product.source === 'woocommerce'
      ? Math.round(product.price)
      : Math.round(product.price * 82);

  const displayOriginalPrice = product.originalPrice
    ? product.source === 'woocommerce'
      ? Math.round(product.originalPrice)
      : Math.round(product.originalPrice * 82)
    : null;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, {
      recipientName: recipientName.trim() || undefined,
      anniversaryDate: anniversaryDate.trim() || undefined,
      spotifySong: spotifySong.trim() || undefined,
    });
    showToast(`Added ${product.name} to your bag! 🎁`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOptions, {
      recipientName: recipientName.trim() || undefined,
      anniversaryDate: anniversaryDate.trim() || undefined,
      spotifySong: spotifySong.trim() || undefined,
    });
    navigateTo('checkout');
  };

  return (
    <div className="px-gutter pt-4 pb-40 text-on-surface min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigateBack()}
        className="inline-flex items-center space-x-1 text-xs font-label-md text-secondary mb-3 cursor-pointer hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Back to Vault</span>
      </button>

      {/* Main Larger Image Card */}
      <div className="rounded-2xl liquid-glass-tier-2 p-3 border border-white/90 mb-4 shadow-sm">
        <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#FFFDFB] dark:bg-[#2A1D28] flex items-center justify-center p-4 border border-[#EADBCE]/50">
          <img
            src={productImages[activeImgIdx] || productImages[0]}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Save to Wishlist"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-sm border border-stone-200/60 flex items-center justify-center text-[#814f65] active:scale-90 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ba1a1a' } : {}}
            >
              {wishlisted ? 'favorite' : 'favorite_border'}
            </span>
          </button>
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#4A234A] text-white shadow-sm">
              {product.categoryLabel || 'Atelier'}
            </span>
            {product.onSale && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail switcher if multiple images */}
        {productImages.length > 1 && (
          <div className="flex space-x-2 mt-3 overflow-x-auto no-scrollbar py-1">
            {productImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImgIdx(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-none cursor-pointer bg-[#FFFDFB] p-1 flex items-center justify-center ${
                  activeImgIdx === i ? 'border-[#4A234A] shadow-sm scale-105' : 'border-transparent opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain object-center" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info & Stock Status */}
      <div className="mb-6 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-secondary">
            <span
              className="material-symbols-outlined text-[15px] text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-semibold text-[#241B22]">{product.rating}</span>
            <span className="text-[#6F6468]">({product.reviewCount} reviews)</span>
          </div>

          {/* Stock Status Badge */}
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Out of Stock</span>
            </span>
          )}
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#241B22] leading-tight">
          {product.name}
        </h1>

        <div className="flex items-baseline space-x-3 pt-1">
          <span className="text-2xl text-[#4A234A] font-bold tabular-nums">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {displayOriginalPrice && displayOriginalPrice > displayPrice && (
            <span className="text-sm line-through text-[#6F6468] font-medium tabular-nums">
              ₹{displayOriginalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Full narrative description */}
        <div className="pt-2">
          <h4 className="text-[11px] font-semibold uppercase text-[#814f65] tracking-wider mb-1">
            Description
          </h4>
          <p className="text-xs text-[#534247] leading-relaxed whitespace-pre-line">
            {product.description || product.shortDescription}
          </p>
        </div>
      </div>

      {/* Options */}
      {product.options && product.options.length > 0 &&
        product.options.map((opt) => (
          <div key={opt.name} className="mb-4">
            <label className="font-label-sm text-xs font-semibold text-primary block mb-1.5 uppercase tracking-wide">
              {opt.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((val) => {
                const isSelected =
                  selectedOptions[opt.name] === val || (!selectedOptions[opt.name] && val === opt.values[0]);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-label-md cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary-container text-white font-semibold shadow-sm'
                        : 'liquid-glass-tier-1 text-on-surface-variant'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Personalization studio */}
      {product.customizable && (
        <div className="mb-6 p-4 rounded-xl liquid-glass-tier-1 border border-outline-variant/60 space-y-3">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">auto_fix</span>
            <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
              Personalization Studio
            </span>
          </div>

          <div>
            <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">
              Recipient Name(s) / Initial
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Sophia & Julian"
              className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/50 text-xs font-headline-sm text-primary outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">
              Date / Sentiment Message
            </label>
            <input
              type="text"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              placeholder="e.g. October 14, 2024"
              className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/50 text-xs font-headline-sm text-primary outline-none"
            />
          </div>
        </div>
      )}

      {/* Recently Viewed Products History Section */}
      <RecentlyViewedSection currentProductId={product?.id} isMobile={true} />

      {/* Floating Bottom Purchase Bar */}
      <div className="fixed bottom-20 left-0 right-0 p-3 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 z-40 flex items-center gap-3 px-gutter shadow-2xl">
        <div className="flex items-center rounded-full liquid-glass-tier-1 border border-outline-variant/50 px-2 py-1 flex-none">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 flex items-center justify-center font-bold text-primary cursor-pointer"
          >
            -
          </button>
          <span className="w-6 text-center text-xs font-bold tabular-nums text-primary">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 flex items-center justify-center font-bold text-primary cursor-pointer"
          >
            +
          </button>
        </div>

        <AnimatedAddToCartButton
          onAdd={handleAddToCart}
          disabled={!product.inStock}
          label="ADD TO BAG"
          className="flex-1 py-3"
        />

        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="flex-1 py-3 rounded-full bg-primary text-white font-label-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1 shadow-md active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
        >
          <span>Buy Now</span>
          <span className="material-symbols-outlined text-[16px]">bolt</span>
        </button>
      </div>
    </div>
  );
};
