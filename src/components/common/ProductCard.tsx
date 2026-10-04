import React, { useRef, useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { AnimatedAddToCartButton } from './AnimatedAddToCartButton';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'bts';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant }) => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useShop();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isBts = product.category === 'bts' || variant === 'bts';
  const wishlisted = isWishlisted(product.id);

  // Subtle 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          tilt.x !== 0 || tilt.y !== 0
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.4s ease-out',
      }}
      className={`rounded-3xl p-5 border transition-all duration-300 relative group flex flex-col justify-between ${
        isBts
          ? 'liquid-glass-purple-army border-purple-400/40 text-white shadow-xl hover:shadow-purple-900/40'
          : 'liquid-glass-card border-white/80 text-brand-dark shadow-md hover:shadow-2xl'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-tr from-pink-100/50 to-amber-50/50 flex items-center justify-center p-3">
        {/* Category & Sale Label */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
              isBts
                ? 'bg-purple-600 text-white'
                : product.isBestseller
                ? 'bg-brand-plum text-white'
                : 'bg-brand-rosegold text-brand-dark'
            }`}
          >
            {product.categoryLabel}
          </span>
          {product.onSale && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-sm ${
            isBts
              ? 'bg-black/30 backdrop-blur-md text-purple-200 hover:text-white'
              : 'liquid-glass-pill text-brand-plum hover:text-red-500'
          } ${wishlisted ? 'text-red-500 fill-red-500' : ''}`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Product Image with Hover Zoom */}
        <div
          onClick={() => navigateTo('product-details', product.slug)}
          className="w-full h-full flex items-center justify-center cursor-pointer overflow-hidden rounded-xl"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl transform transition-transform duration-700 group-hover:scale-108"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Quick View Floating Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          aria-label="Quick View"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-3.5 py-1.5 rounded-full bg-white/90 text-brand-plum text-[11px] font-semibold tracking-wider uppercase shadow-lg backdrop-blur-md flex items-center gap-1.5 hover:bg-white cursor-pointer z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Metadata & Title */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isBts ? 'text-purple-300' : 'text-brand-gray'
              }`}
            >
              {product.craftingTime} Crafting
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className={isBts ? 'text-purple-200' : 'text-brand-dark'}>
                {product.rating}
              </span>
            </div>
          </div>

          <h3
            onClick={() => navigateTo('product-details', product.slug)}
            className={`font-serif text-base sm:text-lg font-medium cursor-pointer transition-colors line-clamp-1 mb-1.5 ${
              isBts
                ? 'text-white hover:text-purple-200'
                : 'text-brand-dark group-hover:text-brand-plum'
            }`}
          >
            {product.name}
          </h3>

          <p
            className={`text-xs line-clamp-2 mb-3 leading-relaxed ${
              isBts ? 'text-purple-200/70' : 'text-brand-gray'
            }`}
          >
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span
                className="text-[1.25rem] font-bold font-sans tabular-nums text-[#4A234A] tracking-tight"
                style={{ fontSize: '1.25rem', color: '#4A234A' }}
              >
                ₹{product.source === 'woocommerce'
                  ? Math.round(product.price).toLocaleString('en-IN')
                  : Math.round(product.price * 82).toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span
                  className={`text-xs line-through tabular-nums ${
                    isBts ? 'text-purple-300/50' : 'text-brand-gray/60'
                  }`}
                >
                  ₹{product.source === 'woocommerce'
                    ? Math.round(product.originalPrice).toLocaleString('en-IN')
                    : Math.round(product.originalPrice * 82).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.customizable && (
              <span className="text-[10px] uppercase font-semibold text-brand-rosegold tracking-wider">
                Personalized
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AnimatedAddToCartButton
              onAdd={() => addToCart(product, 1)}
              label="ADD TO CART"
              theme={isBts ? 'purple' : 'plum'}
              className="w-full py-2.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
