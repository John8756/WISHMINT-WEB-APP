import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Heart, Music, Mail, Calendar, ArrowRight, Check, Sparkles } from 'lucide-react';

export const CouplesPage: React.FC = () => {
  const { navigateTo } = useShop();

  const couplesProducts = PRODUCTS.filter((p) => p.category === 'couples');
  const relatedProducts = PRODUCTS.filter((p) => p.category !== 'couples').slice(0, 3);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Couples Edition' }]} />

      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 md:p-16 mb-16 overflow-hidden liquid-glass-card border border-white/90 shadow-2xl bg-gradient-to-br from-rose-100/60 via-pink-50/40 to-brand-cream">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-300/30 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-softPink/40 blur-[90px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-brand-plum text-xs font-semibold tracking-widest uppercase mb-4 border border-rose-300">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Page 71 · Couples & Anniversaries</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-brand-dark leading-tight mb-6">
              Every Chapter of <br />
              <span className="italic font-normal text-brand-plum font-serif">Your Love Story.</span>
            </h1>

            <p className="text-base text-brand-gray leading-relaxed max-w-xl mb-8">
              From the song playing when you first met to your private wedding vows. Commemorate relationship milestones with acoustic scannable Spotify glass frames, deckled-edge calligraphy love letters, and engraved wooden keepsakes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateTo('product-details', 'personalized-acoustic-photo-frame')}
                className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
              >
                <span>Customize Acoustic Frame ($49)</span>
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
                src="/src/assets/images/wishmint_couples_frame_1790798389948.jpg"
                alt="Personalized Acoustic Couples Frame"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Romantic Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="liquid-glass-pill p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-none">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-brand-dark mb-0.5">Spotify Soundwave</h4>
            <p className="text-xs text-brand-gray">Precision metallic waveform with instant camera scan</p>
          </div>
        </div>

        <div className="liquid-glass-pill p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-none">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-brand-dark mb-0.5">Anniversary Coordinates</h4>
            <p className="text-xs text-brand-gray">Engrave exact latitude/longitude where you met</p>
          </div>
        </div>

        <div className="liquid-glass-pill p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-none">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-brand-dark mb-0.5">Wax-Sealed Letters</h4>
            <p className="text-xs text-brand-gray">Fountain pen calligraphy on handmade cotton paper</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 block mb-1">
              Romantic Keepsakes
            </span>
            <h2 className="font-serif text-3xl font-light text-brand-dark">
              Couples & <span className="italic font-normal text-brand-plum font-serif">Anniversary Gifts</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {couplesProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Romantic Customizer Feature */}
      <section className="liquid-glass-card rounded-3xl p-8 md:p-12 border border-white/80 mb-20 bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-brand-cream">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
            Anniversary Milestone Registry
          </span>
          <h3 className="font-serif text-3xl font-light text-brand-dark mb-6">
            "I would choose you in a hundred lifetimes."
          </h3>
          <p className="text-sm text-brand-gray leading-relaxed mb-8">
            Paper (1st), Cotton (2nd), Leather (3rd), Wood (5th) — whatever year you are celebrating, our atelier prepares every gift with custom date embossing, certified gold foil seals, and bespoke packaging ready to present.
          </p>
          <div className="inline-flex items-center gap-5 text-xs font-semibold text-brand-plum">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Archival UV ink guaranteed for 50+ years
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Complimentary luxury gift box with ribbon
            </span>
          </div>
        </div>
      </section>

      {/* Related Keepsakes */}
      <div>
        <h3 className="font-serif text-2xl font-light text-brand-dark mb-6">
          More Bespoke <span className="italic font-normal text-brand-plum font-serif">Artisanal Gifts</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
