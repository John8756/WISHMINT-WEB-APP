import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Scissors, Sparkles, Feather, Heart, ArrowRight, Check } from 'lucide-react';

export const HandmadePage: React.FC = () => {
  const { navigateTo } = useShop();

  const handmadeProducts = PRODUCTS.filter((p) => p.category === 'handmade');
  const otherProducts = PRODUCTS.filter((p) => p.category !== 'handmade').slice(0, 3);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <Breadcrumb items={[{ label: 'Handmade Studio' }]} />

      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 md:p-16 mb-16 overflow-hidden liquid-glass-card border border-white/90 shadow-2xl bg-gradient-to-br from-amber-50/70 via-rose-50/50 to-brand-cream">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-softPink/40 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-rosegold/30 blur-[90px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-brand-plum text-xs font-semibold tracking-widest uppercase mb-4 border border-brand-softPink">
              <Scissors className="w-3.5 h-3.5 text-brand-rosegold" />
              <span>Yarn & Tactile Studio</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-brand-dark leading-tight mb-6">
              Forever Blooms, <br />
              <span className="italic font-normal text-brand-plum font-serif">Handcrafted Petal by Petal.</span>
            </h1>

            <p className="text-base text-brand-gray leading-relaxed max-w-xl mb-8">
              Every petal is individually crocheted from hypoallergenic organic milk cotton yarn. Unlike fresh florals that fade within a week, our handmade bouquets and plush keepsakes carry permanent warmth and sentiment.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateTo('product-details', 'handmade-pastel-crochet-bouquet')}
                className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>Shop Featured Bouquet ($56)</span>
                <ArrowRight className="w-4 h-4 text-brand-rosegold" />
              </button>
              <button
                onClick={() => navigateTo('shop')}
                className="liquid-glass-pill text-brand-plum text-xs font-semibold uppercase tracking-widest px-7 py-4 rounded-full hover:bg-white transition-all cursor-pointer border border-brand-rosegold/40"
              >
                View All Gifts
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden liquid-glass-card p-3 border border-white/80 shadow-2xl">
              <img
                src="/src/assets/images/wishmint_handmade_bouquet_1790798364240.jpg"
                alt="Handmade Crochet Bouquet"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Handmade Features Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="liquid-glass-pill p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center flex-none">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-brand-dark mb-0.5">Milk Cotton Yarn</h4>
            <p className="text-xs text-brand-gray">Super soft, hypoallergenic, non-fading dyes</p>
          </div>
        </div>

        <div className="liquid-glass-pill p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center flex-none">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-brand-dark mb-0.5">Bendable Wire Stems</h4>
            <p className="text-xs text-brand-gray">Effortlessly adjust stems into any vase</p>
          </div>
        </div>

        <div className="liquid-glass-pill p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center flex-none">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-brand-dark mb-0.5">Lavender Mist Infused</h4>
            <p className="text-xs text-brand-gray">Subtly fragranced for unboxing delight</p>
          </div>
        </div>
      </div>

      {/* Collection Product Grid */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-rosegold block mb-1">
              Atelier Selection
            </span>
            <h2 className="font-serif text-3xl font-light text-brand-dark">
              Handmade Studio <span className="italic font-normal text-brand-plum font-serif">Pieces</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {handmadeProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Artisanal Process Story */}
      <section className="liquid-glass-card rounded-3xl p-8 md:p-12 border border-white/80 mb-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
            The Process
          </span>
          <h3 className="font-serif text-3xl font-light text-brand-dark mb-6">
            Four hours of devoted stitchwork in every stem.
          </h3>
          <p className="text-sm text-brand-gray leading-relaxed mb-8">
            Our artisans begin by winding custom-dyed combed cotton yarn over Japanese ergonomic crochet hooks. Each tulip petal requires over 140 individual loops, wire support integration, steam shaping, and delicate stem binding in parchment paper with a hand-tied double satin bow.
          </p>
          <div className="inline-flex items-center gap-4 text-xs font-semibold text-brand-plum">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Never wilts
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Dust-repellent yarn
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Scented unboxing
            </span>
          </div>
        </div>
      </section>

      {/* Related Keepsakes */}
      <div>
        <h3 className="font-serif text-2xl font-light text-brand-dark mb-6">
          Complementary <span className="italic font-normal text-brand-plum font-serif">Bespoke Keepsakes</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
