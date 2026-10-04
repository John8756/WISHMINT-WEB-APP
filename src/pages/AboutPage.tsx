import React from 'react';
import { useShop } from '../context/ShopContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Feather, Heart, Sparkles, Check, ArrowRight, Scissors, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Our Story' }]} />

      {/* Hero Narrative */}
      <section className="relative rounded-3xl p-8 md:p-16 mb-20 overflow-hidden liquid-glass-card border border-white/90 shadow-2xl bg-gradient-to-b from-brand-cream via-brand-blush/30 to-brand-cream text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-rosegold block mb-3 font-sans">
            The Wishmint Atelier Story
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-brand-dark leading-tight mb-6">
            Turning ordinary moments into{' '}
            <span className="italic font-normal text-brand-plum font-serif">tangible memories.</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-gray font-normal leading-relaxed mb-8">
            WISHMINT was founded in 2024 out of dissatisfaction with the impersonal world of mass-market online gifting. We set out to build an artisanal gifting house where every bouquet is hand-crocheted, every ribbon is hand-tied, and every inscription is permanently honored in gold leaf foil.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>Explore Our Keepsakes</span>
              <ArrowRight className="w-4 h-4 text-brand-rosegold" />
            </button>
          </div>
        </div>
      </section>

      {/* 3 Pillars of Atelier Ethos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 shadow-md">
          <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-6">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-brand-plum mb-3">
            Handcrafted with Heart
          </h3>
          <p className="text-xs text-brand-gray leading-relaxed">
            No soulless factory lines. Our crochet artisans spend up to 4 hours per bouquet, carefully forming delicate yarn petals from hypoallergenic organic milk cotton.
          </p>
        </div>

        <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 shadow-md">
          <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-6">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-brand-plum mb-3">
            Permanence & Longevity
          </h3>
          <p className="text-xs text-brand-gray leading-relaxed">
            Fresh flowers wilt in days. Our everlasting bouquets, optical soundwave glass frames, and archival foil prints remain radiant for decades on bedroom tables and desks.
          </p>
        </div>

        <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 shadow-md">
          <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-6">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-brand-plum mb-3">
            Unboxing Reverence
          </h3>
          <p className="text-xs text-brand-gray leading-relaxed">
            From the moment your recipient cuts the outer satin ribbon and inhales the natural lavender wax tablet, the unboxing is choreographed to produce genuine tears of joy.
          </p>
        </div>
      </div>

      {/* Visual Atelier Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
        <div className="lg:col-span-6 relative aspect-square rounded-3xl overflow-hidden liquid-glass-card p-3 border border-white/90 shadow-2xl">
          <img
            src="/src/assets/images/wishmint_hamper_unboxing_1790798402606.jpg"
            alt="Wishmint Atelier Studio Unboxing"
            className="w-full h-full object-cover rounded-2xl"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block font-sans">
            Our Sustainable Packaging Promise
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-brand-dark leading-tight">
            Zero single-use plastics, <br />
            <span className="italic font-normal text-brand-plum font-serif">100% recyclable luxury.</span>
          </h2>
          <p className="text-sm text-brand-gray leading-relaxed">
            We reject bubble wrap and plastic tape. Instead, our delicate glass and yarn creations are cradled in FSC-certified honeycomb paper cushioning, tied with reusable high-thread satin ribbon, and enclosed in heavy board keepsake boxes intended to store letters for years to come.
          </p>
          <div className="space-y-3 pt-2 text-xs text-brand-plum font-semibold">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Certified FSC rigid gift boxes & deckled cotton papers</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Natural soy wax seals with non-toxic pigment dyes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Carbon-neutral tracked post on all worldwide deliveries</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
