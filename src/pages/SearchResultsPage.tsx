import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Search, Sparkles, X } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { searchQuery, setSearchQuery, products, navigateTo } = useShop();
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localInput.trim());
  };

  const allAvailable = products && products.length > 0 ? products : PRODUCTS;
  const activeQuery = localInput.trim() || searchQuery.trim();

  const matchingProducts = allAvailable.filter((p) => {
    if (!activeQuery) return true;
    const query = activeQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  });

  const popularSearches = [
    'Crochet Bouquet',
    'BTS Whale',
    'Spotify Frame',
    'Shadowbox',
    'Wax Seal Letter',
    'Anniversary',
  ];

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <Breadcrumb items={[{ label: 'Search Results' }]} />

      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
          Atelier Search
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark mb-6">
          Find Your <span className="italic font-normal text-brand-plum font-serif">Perfect Gift</span>
        </h1>

        {/* Live Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-4">
          <Search className="absolute left-5 w-5 h-5 text-brand-plum/60" />
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Search by sentiment, item, BTS member, or occasion..."
            className="w-full pl-14 pr-28 py-4 rounded-full bg-white/90 border border-brand-plum/20 text-sm text-brand-dark focus:outline-none focus:border-brand-rosegold shadow-md"
          />
          {localInput && (
            <button
              type="button"
              onClick={() => {
                setLocalInput('');
                setSearchQuery('');
              }}
              className="absolute right-24 text-brand-gray hover:text-brand-dark"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2.5 px-6 py-2.5 rounded-full liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-md"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-brand-gray font-medium">Suggestions:</span>
          {popularSearches.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setLocalInput(s);
                setSearchQuery(s);
              }}
              className="px-3 py-1 rounded-full liquid-glass-pill hover:bg-white text-brand-plum text-xs transition-colors cursor-pointer border border-brand-plum/10"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Query Notice */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-plum/10">
        <h2 className="font-serif text-xl text-brand-dark">
          {searchQuery ? (
            <>
              Showing results for "<span className="text-brand-plum font-semibold">{searchQuery}</span>"
            </>
          ) : (
            'Showing All Curated Gifts'
          )}
        </h2>
        <span className="text-xs text-brand-gray font-medium">
          {matchingProducts.length} items found
        </span>
      </div>

      {/* Results Grid */}
      {matchingProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matchingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-white/80 my-10 shadow-lg">
          <Sparkles className="w-12 h-12 text-brand-rosegold mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-brand-dark mb-2">No Results Found</h3>
          <p className="text-xs text-brand-gray leading-relaxed mb-6">
            We couldn't find any gifts matching "{searchQuery}". Try browsing by collection or check our popular suggestions above.
          </p>
          <button
            onClick={() => {
              setLocalInput('');
              setSearchQuery('');
            }}
            className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer hover:brightness-110"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};
