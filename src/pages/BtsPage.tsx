import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Sparkles, Moon, Star, Heart, ArrowRight, Music, Check } from 'lucide-react';

export const BtsPage: React.FC = () => {
  const { navigateTo } = useShop();

  const btsProducts = PRODUCTS.filter((p) => p.category === 'bts');
  const relatedProducts = PRODUCTS.filter((p) => p.category !== 'bts').slice(0, 3);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'BTS ARMY Collection' }]} />

      {/* Hero Section (Purple Dominant Ambient Glow) */}
      <section className="relative rounded-3xl p-8 md:p-16 mb-16 overflow-hidden liquid-glass-purple-army border border-purple-400/50 shadow-2xl text-white">
        {/* Constellation & Starlight effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(142,68,173,0.4),transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-purple-600/30 blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/80 text-purple-200 text-xs font-semibold tracking-widest uppercase mb-4 border border-purple-400/40">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Page 37 · Borahae Keepsake Atelier</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              For Every Single <br />
              <span className="italic font-normal text-purple-300 font-serif">ARMY Heart. 💜</span>
            </h1>

            <p className="text-base text-purple-200/90 leading-relaxed max-w-xl mb-8">
              Inspired by Whalien 52, Mikrokosmos, and Spring Day. Hand-crocheted purple whales in illuminated starlight cloches, custom lyric song scrolls, and concert milestone keepsakes built to commemorate our eternal galaxy of purple lights.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateTo('product-details', 'bts-mikrokosmos-memory-chest')}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer border border-purple-300/40"
              >
                <span>Shop Starlight Cloche ($74)</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </button>
              <button
                onClick={() => navigateTo('shop')}
                className="bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-semibold uppercase tracking-widest px-7 py-4 rounded-full transition-all cursor-pointer border border-purple-400/40"
              >
                Explore Full Catalog
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden liquid-glass-purple-army p-3 border border-purple-400/60 shadow-2xl">
              <img
                src="/src/assets/images/wishmint_bts_whale_1790798376874.jpg"
                alt="BTS Mikrokosmos Whale Cloche"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BTS Highlights Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="liquid-glass-purple-army p-6 rounded-2xl border border-purple-400/30 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-700/60 border border-purple-400/40 flex items-center justify-center flex-none">
            <Moon className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-purple-100 mb-0.5">
              Whalien 52 Keepsake
            </h4>
            <p className="text-xs text-purple-200/70">Hand-stitched violet yarn whale with starlight dust</p>
          </div>
        </div>

        <div className="liquid-glass-purple-army p-6 rounded-2xl border border-purple-400/30 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-700/60 border border-purple-400/40 flex items-center justify-center flex-none">
            <Music className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-purple-100 mb-0.5">
              Mikrokosmos Lyrics
            </h4>
            <p className="text-xs text-purple-200/70">Personalized lyric transcript in gold foil calligraphy</p>
          </div>
        </div>

        <div className="liquid-glass-purple-army p-6 rounded-2xl border border-purple-400/30 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-700/60 border border-purple-400/40 flex items-center justify-center flex-none">
            <Star className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <h4 className="font-serif text-base font-medium text-purple-100 mb-0.5">
              Touch-LED Starlight
            </h4>
            <p className="text-xs text-purple-200/70">Integrated soft ambient glow battery cloche</p>
          </div>
        </div>
      </div>

      {/* BTS Products Grid */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 block mb-1">
              Collector's Editions
            </span>
            <h2 className="font-serif text-3xl font-light text-brand-dark">
              BTS ARMY <span className="italic font-normal text-purple-800 font-serif">Borahae Catalog</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {btsProducts.map((p) => (
            <ProductCard key={p.id} product={p} variant="bts" />
          ))}
        </div>
      </div>

      {/* BTS Emotional Story */}
      <section className="liquid-glass-card rounded-3xl p-8 md:p-12 border border-white/80 mb-20 bg-gradient-to-r from-purple-50/60 via-pink-50/40 to-brand-cream">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-800 block mb-2">
            7 Hearts, 1 Universe
          </span>
          <h3 className="font-serif text-3xl font-light text-brand-dark mb-6">
            "You got me, I dream while looking at you."
          </h3>
          <p className="text-sm text-brand-gray leading-relaxed mb-8">
            Whether gifting your fellow ARMY for a birthday, commemorating a historic concert date, or celebrating BTS anniversaries, every Wishmint Borahae keepsake is built with the highest design discipline. No cheap unlicensed badges — only museum-grade glass, plush cotton yarn, and personalized gold typography.
          </p>
          <div className="inline-flex items-center gap-5 text-xs font-semibold text-purple-900">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-700" /> OT7 Member charms available
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-700" /> Custom Spotify song integration
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-700" /> Deluxe plum collector packaging
            </span>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <div>
        <h3 className="font-serif text-2xl font-light text-brand-dark mb-6">
          More Loved <span className="italic font-normal text-brand-plum font-serif">Keepsakes</span>
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
