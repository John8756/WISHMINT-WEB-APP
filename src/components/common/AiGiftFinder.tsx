import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { AnimatedAddToCartButton } from './AnimatedAddToCartButton';
import {
  Sparkles,
  Search,
  Gift,
  ArrowRight,
  Heart,
  ShoppingBag,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface RecommendedProduct extends Product {
  matchScore: number;
  matchReason: string;
}

const SUGGESTED_KEYWORDS = [
  'Boyfriend',
  'Best Friend',
  'Valentine',
  'Anniversary',
  'Mother',
  'BTS ARMY',
  'Birthday',
] as const;

// Keyword domain relevance mappings
const KEYWORD_RULES: Record<string, { categories: string[]; terms: string[]; reasons: Record<string, string> }> = {
  boyfriend: {
    categories: ['couples', 'custom'],
    terms: ['acoustic', 'photo', 'soundwave', 'shadowbox', 'chest', 'frame', 'date', 'song'],
    reasons: {
      'personalized-acoustic-photo-frame': 'Scannable Spotify frame preserving your memorable song and date.',
      'bespoke-monogram-memory-shadowbox': 'Architectural ribbon shadowbox personalized with your initials.',
      'deluxe-velvet-gifting-chest': 'Italian velvet keepsake chest hot-stamped with his name.',
      default: 'A bespoke personalized keepsake tailored with your private milestone dates.',
    },
  },
  'best friend': {
    categories: ['handmade', 'bts', 'custom'],
    terms: ['crochet', 'bouquet', 'heart', 'keyring', 'whale', 'friend', 'everlasting', 'flowers'],
    reasons: {
      'handmade-pastel-crochet-bouquet': 'Everlasting hand-crocheted blossoms that will never wilt on their desk.',
      'crochet-plush-heart-keyring': 'Pocket-sized artisan plush heart to carry on everyday bags.',
      'bts-mikrokosmos-memory-chest': 'Whimsical starlight dome celebrating unbreakable bonds.',
      default: 'A heartwarming handcrafted piece designed to celebrate enduring companionship.',
    },
  },
  valentine: {
    categories: ['couples', 'custom', 'handmade'],
    terms: ['love', 'letter', 'wax', 'heart', 'photo', 'frame', 'romance', 'couple'],
    reasons: {
      'wax-sealed-love-letter-keepsake': 'Calligraphy vows transcribed on handmade deckled cotton paper with wax seal.',
      'personalized-acoustic-photo-frame': 'Captures your favorite romantic photo with precision gold soundwave.',
      'deluxe-velvet-gifting-chest': 'Opulent velvet presentation coffer with botanical scented tablets.',
      default: 'Deeply romantic keepsake handcrafted with wax seals and metallic foil stamping.',
    },
  },
  anniversary: {
    categories: ['couples', 'custom'],
    terms: ['anniversary', 'wedding', 'vows', 'frame', 'date', 'shadowbox', 'acoustic', 'love'],
    reasons: {
      'personalized-acoustic-photo-frame': 'Commemorates the exact first dance or proposal song on archival glass.',
      'bespoke-monogram-memory-shadowbox': 'Museum-grade shadowbox commemorating your shared wedding initial.',
      'wax-sealed-love-letter-keepsake': 'Preserves your personal wedding vows in authentic poured sealing wax.',
      default: 'Milestone keepsake designed to celebrate milestones and years together.',
    },
  },
  mother: {
    categories: ['handmade', 'custom'],
    terms: ['bouquet', 'crochet', 'tulip', 'chest', 'sachet', 'lavender', 'rose', 'flowers'],
    reasons: {
      'handmade-pastel-crochet-bouquet': 'Handmade milk-cotton floral bouquet scented with real botanical lavender.',
      'deluxe-velvet-gifting-chest': 'Elegant velvet coffer packed with artisanal scented sachets & love letter.',
      'bespoke-monogram-memory-shadowbox': 'Custom gold foil shadowbox honoring family initials and maternal devotion.',
      default: 'Everlasting floral and aromatic keepsake to honor motherly devotion.',
    },
  },
  'bts army': {
    categories: ['bts'],
    terms: ['bts', 'borahae', 'whale', 'mikrokosmos', 'purple', 'starlight', 'army', 'violet'],
    reasons: {
      'bts-mikrokosmos-memory-chest': 'Illuminated purple starlight cloche with hand-crocheted Whalien & lyrics.',
      'borahae-purple-whale-starlight-keyring': 'Pocket crochet purple whale with 00:00 charm and member initial.',
      default: 'Collector-grade Borahae treasure celebrating the eternal BTS & ARMY bond.',
    },
  },
  birthday: {
    categories: ['custom', 'handmade', 'bts'],
    terms: ['chest', 'hamper', 'bouquet', 'shadowbox', 'whale', 'celebration', 'gift'],
    reasons: {
      'deluxe-velvet-gifting-chest': 'The ultimate unboxing experience featuring personalized foil calligraphy.',
      'handmade-pastel-crochet-bouquet': 'Cheerful handmade bouquet of tulips & daisies for their special day.',
      'bespoke-monogram-memory-shadowbox': 'Heirloom initial shadowbox that stands proud on bedroom or work desk.',
      default: 'A personalized birthday gift that outshines standard store-bought presents.',
    },
  },
};

export const AiGiftFinder: React.FC = () => {
  const { products, navigateTo, addToCart, showToast } = useShop();

  const [activeKeyword, setActiveKeyword] = useState<string>('Boyfriend');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Smart matching engine algorithm
  const recommendations = useMemo<RecommendedProduct[]>(() => {
    if (!products || products.length === 0) return [];

    const effectiveKeyword = activeKeyword.toLowerCase();
    const queryTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const rule = KEYWORD_RULES[effectiveKeyword];

    const scored = products.map((prod) => {
      let score = 50; // base score

      const name = prod.name.toLowerCase();
      const desc = (prod.description + ' ' + prod.shortDescription).toLowerCase();
      const cat = prod.category.toLowerCase();
      const slug = prod.slug.toLowerCase();

      // Category affinity matching
      if (rule && rule.categories.includes(cat)) {
        score += 25;
      }

      // Keyword domain relevance matching
      if (rule) {
        rule.terms.forEach((term) => {
          if (name.includes(term)) score += 12;
          if (desc.includes(term)) score += 6;
        });
      }

      // User search query terms matching
      if (queryTerms.length > 0) {
        queryTerms.forEach((term) => {
          if (name.includes(term)) score += 20;
          if (desc.includes(term)) score += 10;
          if (cat.includes(term)) score += 15;
          if (slug.includes(term)) score += 10;
        });
      }

      // Best sellers & reviews boost
      if (prod.isBestseller) score += 5;
      if (prod.rating >= 4.95) score += 4;

      // Determine tailored match reason
      let matchReason = rule?.reasons[slug] || rule?.reasons['default'];
      if (!matchReason) {
        matchReason = `Curated matching ${prod.categoryLabel} handcrafted in our studio.`;
      }

      // Scale score between 88% and 99%
      const finalPercentage = Math.min(99, Math.max(88, Math.round(score > 100 ? 98 : score)));

      return {
        ...prod,
        matchScore: finalPercentage,
        matchReason,
      };
    });

    // Sort by match score descending and return top 3
    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [products, activeKeyword, searchQuery]);

  const handleSelectKeyword = (kw: string) => {
    setActiveKeyword(kw);
  };

  const handleClearQuery = () => {
    setSearchQuery('');
  };

  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    showToast(`✨ ${product.name} added to your bag!`);
  };

  return (
    <div className="w-full rounded-3xl liquid-glass-card border border-white/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden bg-white/70">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-plum/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-brand-rosegold/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-7 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-pill text-brand-plum text-xs font-semibold uppercase tracking-widest mb-3 border border-brand-plum/15 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-rosegold animate-pulse" />
          <span>Section 6 &bull; AI Gift Finder</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-brand-dark font-normal tracking-tight">
          Discover Their Perfect Present
        </h3>
        <p className="text-xs sm:text-sm text-brand-gray mt-1.5 leading-relaxed">
          Select a recipient or type your custom idea. Our intelligent recommendation algorithm filters existing atelier pieces to reveal their ideal keepsake.
        </p>
      </div>

      {/* STEP A: SUGGESTED KEYWORDS TAGS */}
      <div className="mb-6 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-plum block mb-2 text-center sm:text-left">
          Step A: Select Occasion or Recipient
        </span>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {SUGGESTED_KEYWORDS.map((kw) => {
            const isSelected = activeKeyword === kw;
            return (
              <button
                key={kw}
                type="button"
                onClick={() => handleSelectKeyword(kw)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-xs ${
                  isSelected
                    ? 'liquid-glass-plum text-white shadow-md scale-105'
                    : 'bg-white/80 hover:bg-white text-brand-dark border border-brand-plum/15 hover:border-brand-plum/30'
                }`}
              >
                <span>{kw}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP B: CUSTOM TEXT SEARCH INPUT */}
      <div className="mb-7 relative z-10">
        <label className="text-[11px] font-bold uppercase tracking-wider text-brand-plum block mb-2">
          Step B: Or Type Exactly What You Have in Mind
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-brand-plum/60 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='e.g. "lavender crochet tulips", "anniversary spotify frame", "purple whale"...'
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/90 border border-brand-plum/20 text-xs sm:text-sm text-brand-dark placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-plum focus:ring-2 focus:ring-brand-plum/10 shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearQuery}
              aria-label="Clear search"
              className="absolute right-3.5 p-1 rounded-full hover:bg-black/5 text-brand-gray"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* STEP C: SMART SUGGESTION ENGINE RESULTS */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-plum">
              Step C: AI Recommended Keepsakes
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase font-mono">
              Live Matched
            </span>
          </div>
          <span className="text-[11px] text-brand-gray hidden sm:inline">
            Matching for: <strong>"{searchQuery || activeKeyword}"</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo('product-details', item.slug)}
              className="group p-4 rounded-2xl bg-white/80 border border-white hover:border-brand-rosegold/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
            >
              <div>
                {/* Image & Match Tag */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#FAF7F2]/60 flex items-center justify-center">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    style={{ objectFit: 'contain' }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full liquid-glass-card bg-white/95 text-brand-plum text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 border border-brand-plum/10">
                    <Sparkles className="w-3 h-3 text-brand-rosegold" />
                    <span>{item.matchScore}% Match</span>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] backdrop-blur-xs font-mono">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Details */}
                <h4 className="font-serif text-sm font-semibold text-brand-dark group-hover:text-brand-plum transition-colors line-clamp-1">
                  {item.name}
                </h4>

                <p className="text-[11px] text-brand-gray mt-1 line-clamp-2 leading-relaxed">
                  {item.matchReason}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-3 mt-3 border-t border-brand-plum/10 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-base text-[#4A234A] tabular-nums" style={{ color: '#4A234A' }}>
                    ₹{Math.round(item.price < 150 ? item.price * 82 : item.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <AnimatedAddToCartButton
                  onAdd={() => handleQuickAdd(item)}
                  label="Add to Bag"
                  className="px-3.5 py-1.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
