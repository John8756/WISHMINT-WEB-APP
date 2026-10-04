import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, X, Check } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { navigateTo, products, productsLoading, isLiveWooCommerce } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'handmade', label: 'Handmade Studio' },
    { id: 'bts', label: 'BTS ARMY Borahae' },
    { id: 'couples', label: 'Couples Edition' },
    { id: 'custom', label: 'Bespoke Keepsakes' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (
        searchFilter.trim() &&
        !p.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !p.shortDescription.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        return false;
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [products, selectedCategory, searchFilter, maxPrice, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchFilter('');
    setMaxPrice(100);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <Breadcrumb items={[{ label: 'Shop Catalog' }]} />

      {/* Hero Header */}
      <div className="mb-12 text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
          Curated Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark leading-tight mb-4">
          All Personalized <span className="italic font-normal text-brand-plum font-serif">Gifts & Keepsakes</span>
        </h1>
        <p className="text-brand-gray text-sm sm:text-base max-w-2xl leading-relaxed">
          Discover our entire handcrafted repertoire — from eternal crochet florals to personalized acoustic song frames, BTS starlight domes, and luxury velvet hampers.
        </p>
      </div>

      {/* Control Bar: Categories & Filters */}
      <div className="liquid-glass-card rounded-3xl p-6 border border-white/80 shadow-lg mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const isBts = cat.id === 'bts';
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? isBts
                        ? 'bg-purple-900 text-purple-100 shadow-sm'
                        : 'liquid-glass-plum text-white shadow-sm'
                      : isBts
                      ? 'liquid-glass-pill text-purple-900 hover:bg-purple-50'
                      : 'liquid-glass-pill text-brand-dark hover:bg-white'
                  }`}
                >
                  {cat.label}
                  {isBts && <span className="ml-1.5 text-purple-300">💜</span>}
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-8 py-2 rounded-full bg-white/70 border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-rosegold"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-dark"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-brand-plum hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="py-2 px-3 rounded-full bg-white/80 border border-brand-plum/20 text-xs font-medium text-brand-dark focus:outline-none focus:border-brand-rosegold cursor-pointer"
              >
                <option value="featured">Featured Keepsakes</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Releases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Secondary Filter Line (Price & In Stock) */}
        <div className="mt-5 pt-4 border-t border-brand-plum/10 flex flex-wrap items-center justify-between text-xs text-brand-gray gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="font-semibold text-brand-plum">Max Price:</span>
              <input
                type="range"
                min="15"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-brand-plum cursor-pointer w-28"
              />
              <span className="font-bold text-brand-dark tabular-nums">${maxPrice}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-brand-plum cursor-pointer rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-brand-plum">{displayedProducts.length}</strong> of{' '}
              {filteredProducts.length} gifts
            </span>
            {(selectedCategory !== 'all' || searchFilter || maxPrice < 100 || inStockOnly) && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-rosegold hover:underline font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card rounded-3xl p-12 text-center max-w-lg mx-auto border border-white/80 my-12">
          <Sparkles className="w-12 h-12 text-brand-rosegold mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-brand-dark mb-2">No Matching Gifts Found</h3>
          <p className="text-xs text-brand-gray leading-relaxed mb-6">
            We couldn't find any items matching your selected criteria. Try adjusting your filters or search keywords.
          </p>
          <button
            onClick={resetFilters}
            className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer hover:brightness-110"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <div className="mt-14 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="liquid-glass-pill px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-plum border border-brand-rosegold/50 hover:bg-white transition-all cursor-pointer shadow-sm"
          >
            Load More Products ({filteredProducts.length - visibleCount} Remaining)
          </button>
        </div>
      )}
    </div>
  );
};
