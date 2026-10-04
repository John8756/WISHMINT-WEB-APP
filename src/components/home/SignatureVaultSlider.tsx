import React, { useRef, useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { AnimatedAddToCartButton } from '../common/AnimatedAddToCartButton';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Sparkles,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface SignatureVaultSliderProps {
  className?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const SignatureVaultSlider: React.FC<SignatureVaultSliderProps> = ({
  className = '',
  badge = 'Section 3 • Signature Product Slider',
  title = 'The Signature Vault',
  subtitle = 'Explore our most cherished signature heirlooms, handcrafted with tactile depth and eternal affection.',
}) => {
  const {
    products,
    addToCart,
    showToast,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    setQuickViewProduct,
  } = useShop();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Drag-to-scroll state for desktop & mobile
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Combine local PRODUCTS with dynamic products if available
  const allVaultProducts: Product[] =
    products && products.length > 0 ? products : PRODUCTS;

  // Selected top signature pieces for the slider
  const vaultProducts = allVaultProducts.slice(0, 8);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = 300; // approximate card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.min(Math.max(index, 0), vaultProducts.length - 1));
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [vaultProducts.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const offset = direction === 'left' ? -340 : 340;
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleCardClick = (productSlug: string) => {
    if (!hasMoved) {
      navigateTo('product-details', productSlug);
    }
  };

  const formatInrPrice = (price: number) => {
    // 1 USD approx ₹82 for standard display if raw price is numeric USD
    const inr = price < 150 ? Math.round(price * 82) : Math.round(price);
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* Header with Title & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-plum/10 text-brand-plum text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-plum animate-ping" />
            <span>{badge}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-dark font-medium leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-gray mt-1 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Carousel Arrow Controls (Desktop & Tablet) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous Keepsake"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              canScrollLeft
                ? 'liquid-glass-card border-brand-plum/20 text-brand-plum hover:bg-white hover:scale-105 active:scale-95 shadow-sm'
                : 'opacity-40 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next Keepsake"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              canScrollRight
                ? 'liquid-glass-card border-brand-plum/20 text-brand-plum hover:bg-white hover:scale-105 active:scale-95 shadow-sm'
                : 'opacity-40 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Drag/Swipe Carousel Container */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-1 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {vaultProducts.map((product, idx) => {
          const isFav = isWishlisted(product.id);
          const productImage =
            product.images && product.images.length > 0
              ? product.images[0]
              : '/src/assets/images/wishmint_hamper_unboxing_1790798402606.jpg';

          return (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] flex-none snap-start rounded-3xl liquid-glass-card border border-white/90 p-4 sm:p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between bg-white/90 relative group"
            >
              {/* Top Row: Badge & Wishlist Heart */}
              <div className="flex items-center justify-between mb-3 z-10">
                <span className="px-2.5 py-1 rounded-full bg-brand-plum/10 text-brand-plum text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  {product.isBestseller
                    ? 'Bestseller'
                    : product.categoryLabel || 'Atelier Vault'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                    showToast(
                      isFav
                        ? `Removed ${product.name} from Wishlist`
                        : `Added ${product.name} to Wishlist! 💖`
                    );
                  }}
                  aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-80 cursor-pointer ${
                    isFav
                      ? 'bg-rose-50 text-rose-500 shadow-sm'
                      : 'bg-white/80 text-brand-gray hover:text-brand-plum hover:bg-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>
              </div>

              {/* Product Media Container */}
              <div
                onClick={() => handleCardClick(product.slug)}
                className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3.5 cursor-pointer"
              >
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Inspect / Quick View Pill */}
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4A234A] text-[10px] font-semibold flex items-center gap-1 shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3 text-[#7A58AA]" />
                  <span>Inspect</span>
                </div>
              </div>

              {/* Content Information */}
              <div className="space-y-1 mb-4 flex-1">
                <span className="text-[10px] uppercase font-bold text-brand-rosegold tracking-wider block">
                  {product.categoryLabel || 'Personalized Gift'}
                </span>
                <h3
                  onClick={() => handleCardClick(product.slug)}
                  className="font-serif text-base sm:text-lg font-bold text-brand-dark line-clamp-1 hover:text-brand-plum transition-colors cursor-pointer"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-brand-gray line-clamp-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Bottom Action Bar: Price & CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-brand-plum/10 mt-auto">
                <div>
                  <span
                    className="font-serif font-bold text-[#4A234A] block tabular-nums tracking-tight"
                    style={{ fontSize: '1.25rem', color: '#4A234A' }}
                  >
                    {formatInrPrice(product.price)}
                  </span>
                  <span className="text-[10px] text-brand-gray">
                    Includes gift box
                  </span>
                </div>

                <AnimatedAddToCartButton
                  onAdd={() => {
                    addToCart(product, 1);
                    showToast(`✨ Added ${product.name} to Bag!`);
                  }}
                  label="Add to Bag"
                  className="px-4 py-2"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {vaultProducts.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (!sliderRef.current) return;
              sliderRef.current.scrollTo({ left: i * 320, behavior: 'smooth' });
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSlideIndex === i
                ? 'w-6 bg-brand-plum'
                : 'w-1.5 bg-brand-plum/20 hover:bg-brand-plum/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
