import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { SignatureVaultSlider } from '../components/home/SignatureVaultSlider';
import { PersonalizedGiftingSection } from '../components/common/PersonalizedGiftingSection';
import { WhatsAppSupportSection } from '../components/common/WhatsAppSupportSection';
import { AiGiftFinder } from '../components/common/AiGiftFinder';
import { BuilderPage } from '../components/common/BuilderPage';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Flower2,
  Moon,
  Gift,
  Star,
  Check,
  Package,
  Palette,
  UserCheck,
  Cake,
  CalendarHeart,
  Smile,
  Flame,
  Sun,
  Instagram,
  Scissors,
  Feather,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, addToCart } = useShop();

  // Section 1: Hero Product Story Slider (Continuous Auto-Swipe every 2s)
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;
  const stageRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  // Section 2: Curated Universes Category Auto-Slider (Continuous Auto-Swipe every 2s)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Section 3: Extravaganza filter & Auto-Swipe Showcase Carousel (Continuous Auto-Swipe every 2s)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'handmade' | 'couples' | 'bts'>('all');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Live Customizer Simulator state (for fallback / demo)
  const [simName, setSimName] = useState('Sophia');

  // Section 1: Continuous Auto-Swipe Slider (2s interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 2000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Section 2: Continuous Auto-Swipe Category Slider (2s interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCategoryIndex((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Section 3: Continuous Auto-Swipe Product Carousel (2s interval)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const step = 340;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 25) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedFilter]);

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const xNorm = e.clientX / window.innerWidth - 0.5;
      const yNorm = e.clientY / window.innerHeight - 0.5;

      if (stageRef.current) {
        stageRef.current.style.transform = `rotateY(${xNorm * 4}deg) rotateX(${-yNorm * 4}deg)`;
      }
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${xNorm * 30}px, ${yNorm * 30}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-xNorm * 40}px, ${-yNorm * 40}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340 * direction, behavior: 'smooth' });
    }
  };

  const filteredProducts =
    selectedFilter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedFilter);

  // Hero Slide Data
  const heroSlides = [
    {
      kicker: 'Slide 01 · Signature Keepsake',
      title: 'Made for moments',
      titleAccent: "they'll never forget.",
      desc: 'Personalized gifts handcrafted to turn ordinary moments into timeless, tangible memories. Customized with your songs, dates, and deepest sentiments.',
      primaryCta: 'Shop Personalized Gifts',
      primaryAction: () => navigateTo('shop'),
      secondaryCta: 'Explore Collections',
      secondaryAction: () => navigateTo('handmade'),
      featuredTitle: 'Bespoke Monogram Memory Shadowbox',
      featuredMeta: '2–3 Days · Hand-Assembled',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Si2DpG6mYxXzqIqEvlrb6501pGtZmDAoyy6Ip3N6ZMfzwMIClypPXyA4AC3iHEg6MOIrGoUdto1NOE5PbTzSAaiph1wV_HnaXWK7tdismWxzFUF6OSl3BZ8FDBSLgrmecHhh9na_3WktnnxVq8fsak0de-w1jN-vtqiGk3nF7C-f8KvcrlehkklRL922zglWH_9dtcWoDjC-D1Sklv3d6A4blROf_gB9qX99iqTQir3ikESuDzkxShRUTECajguwgUw',
      tagTitle: 'WISHMINT Studio Edition',
      tagSub: 'Pure Satin Ribbon Monogram & Heart',
      price: '$48.00',
      badgeText: 'Gifting Box Included',
      accentReview: '4.97 (1.2k Reviews)',
    },
    {
      kicker: 'Slide 02 · Everlasting Floral',
      title: 'Flowers that bloom',
      titleAccent: 'forever and ever.',
      desc: 'Every petal individually crocheted by master artisans. Unlike fresh bouquets, these handcrafted yarn blossoms remain a permanent keepsake of your affection.',
      primaryCta: 'Shop Crochet Bouquets',
      primaryAction: () => navigateTo('handmade'),
      secondaryCta: 'View All Florals',
      secondaryAction: () => navigateTo('shop'),
      featuredTitle: 'Blush Rose & Daisy Crochet Stems',
      featuredMeta: '100% Everlasting Cotton',
      image: '/src/assets/images/wishmint_handmade_bouquet_1790798364240.jpg',
      tagTitle: 'Pastel Garden Series',
      tagSub: 'Hand-crocheted tulips & daisies',
      price: '$56.00',
      badgeText: 'Handmade With Love',
      accentReview: '4.95 (890 Reviews)',
    },
    {
      kicker: 'Slide 03 · For Couples',
      title: 'Every chapter',
      titleAccent: 'of your love story.',
      desc: 'Custom photo frames embedded with your song wave, anniversary coordinates, and secret love notes to cherish on your desk or bedside table.',
      primaryCta: 'Shop Couples Gifts',
      primaryAction: () => navigateTo('couples'),
      secondaryCta: 'Customizer Studio',
      secondaryAction: () => navigateTo('product-details', 'personalized-acoustic-photo-frame'),
      featuredTitle: 'Acoustic Memory Soundwave Frame',
      featuredMeta: 'Optical Glass · Scannable Spotify',
      image: '/src/assets/images/wishmint_couples_frame_1790798389948.jpg',
      tagTitle: 'Couples Edition',
      tagSub: 'Real Soundwave + Photo Print',
      price: '$49.00',
      badgeText: 'Scannable Audio',
      accentReview: '4.96 (1.6k Reviews)',
    },
    {
      kicker: 'Slide 04 · BTS / Borahae Editions',
      title: 'For every single',
      titleAccent: 'ARMY heart. 💜',
      desc: 'Curated purple whale crochet keepsakes, Mikrokosmos lyric shadow boxes, and custom photo collections honoring eternal friendship and music.',
      primaryCta: 'Explore BTS Collection',
      primaryAction: () => navigateTo('bts'),
      secondaryCta: 'View Keepsakes',
      secondaryAction: () => navigateTo('shop'),
      featuredTitle: 'Borahae Purple Whale Keepsake',
      featuredMeta: 'Starlight Glass Dome · Lyric Scroll',
      image: '/src/assets/images/wishmint_bts_whale_1790798376874.jpg',
      tagTitle: 'Borahae Edition',
      tagSub: 'Handmade Whale & Starlight Cloche',
      price: '$74.00',
      badgeText: 'I Purple You 💜',
      accentReview: '4.99 (2.1k Reviews)',
      isBtsTheme: true,
    },
    {
      kicker: 'Slide 05 · The Bespoke Hamper',
      title: 'Unboxing a lifetime',
      titleAccent: 'of genuine warmth.',
      desc: 'Complete luxury gift hampers layered with satin ribbon, scented wax sachet, engraved acrylic plate, and your personalized calligraphy letter.',
      primaryCta: 'Build A Custom Gift Box',
      primaryAction: () => navigateTo('product-details', 'deluxe-velvet-gifting-chest'),
      secondaryCta: 'Explore All Gifts',
      secondaryAction: () => navigateTo('shop'),
      featuredTitle: 'Deluxe Velvet Gifting Chest',
      featuredMeta: 'Italian Velvet · Wax Seal #94',
      image: '/src/assets/images/wishmint_hamper_unboxing_1790798402606.jpg',
      tagTitle: 'The Bespoke Hamper',
      tagSub: 'Personalized Foil Monogram',
      price: '$79.00',
      badgeText: 'Wax Sealed',
      accentReview: '4.98 (640 Reviews)',
    },
  ];

  const activeSlideData = heroSlides[currentSlide];

  return (
    <div className="overflow-hidden">
      {/* ==========================================
          06. HERO — PREMIUM PRODUCT STORY SLIDER
          ========================================== */}
      <section
        id="hero"
        className="relative min-h-screen pt-24 sm:pt-28 pb-16 flex items-center justify-center overflow-hidden perspective-1000"
      >
        {/* Ambient Depth Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            ref={orb1Ref}
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-brand-softPink/30 blur-[130px] animate-float-1"
          />
          <div
            ref={orb2Ref}
            className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-brand-blush/40 blur-[120px] animate-float-2"
          />
          <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-rosegold/20 blur-[140px]" />
          <div className="absolute top-1/4 left-1/5 w-3 h-3 rounded-full bg-brand-rosegold/50 blur-[1px] animate-pulse" />
          <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-brand-plum/30 blur-[1px]" />
          <div className="absolute top-1/2 left-3/4 w-4 h-4 rounded-full bg-brand-softPink/60 blur-[2px]" />
        </div>

        {/* Dynamic Parallax Stage */}
        <div
          ref={stageRef}
          className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col justify-center min-h-[80vh] transition-transform duration-300 ease-out transform-style-3d"
        >
          {/* Active Slide Display */}
          <div className="relative w-full min-h-[540px] md:min-h-[600px] flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text & Editorial CTA Panel */}
              <div className="lg:col-span-6 flex flex-col justify-center text-left z-20">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold tracking-widest uppercase mb-5 w-fit border ${
                    activeSlideData.isBtsTheme
                      ? 'border-purple-300 text-purple-900'
                      : 'border-brand-softPink text-brand-plum'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeSlideData.isBtsTheme ? 'bg-purple-600' : 'bg-brand-rosegold'
                    }`}
                  />
                  <span>{activeSlideData.kicker}</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-brand-dark leading-[1.08] tracking-tight mb-6">
                  {activeSlideData.title} <br />
                  <span
                    className={`italic font-normal font-serif ${
                      activeSlideData.isBtsTheme ? 'text-purple-800' : 'text-brand-plum'
                    }`}
                  >
                    {activeSlideData.titleAccent}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-brand-gray font-normal max-w-xl mb-8 leading-relaxed">
                  {activeSlideData.desc}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={activeSlideData.primaryAction}
                    className={`font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group cursor-pointer ${
                      activeSlideData.isBtsTheme
                        ? 'liquid-glass-purple-army text-white'
                        : 'liquid-glass-plum text-white'
                    }`}
                  >
                    <span>{activeSlideData.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 text-brand-rosegold transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={activeSlideData.secondaryAction}
                    className="liquid-glass-pill text-brand-plum font-sans text-xs font-semibold uppercase tracking-widest px-7 py-4 rounded-full hover:bg-white/80 transition-all border border-brand-rosegold/40 cursor-pointer"
                  >
                    {activeSlideData.secondaryCta}
                  </button>
                </div>

                {/* Specs Badge */}
                <div className="mt-10 flex items-center gap-6 pt-6 border-t border-brand-plum/10">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-brand-gray block">
                      Featured Item
                    </span>
                    <span className="font-serif text-base font-medium text-brand-plum">
                      {activeSlideData.featuredTitle}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-brand-plum/15" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-brand-gray block">
                      Crafting Time
                    </span>
                    <span className="text-xs font-semibold text-brand-dark">
                      {activeSlideData.featuredMeta}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3D Layered Product Showcase */}
              <div className="lg:col-span-6 relative flex items-center justify-center h-full min-h-[360px] lg:min-h-[500px]">
                {/* Back Glass Halo */}
                <div
                  className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl -z-10 transform scale-110 ${
                    activeSlideData.isBtsTheme
                      ? 'bg-gradient-to-tr from-purple-800/40 to-indigo-900/30'
                      : 'bg-gradient-to-tr from-brand-blush/60 to-brand-softPink/30'
                  }`}
                />

                {/* Main Product Showcase Card */}
                <div
                  className={`relative z-10 w-full max-w-[420px] aspect-square rounded-3xl p-3 shadow-2xl transition-all duration-500 border ${
                    activeSlideData.isBtsTheme
                      ? 'liquid-glass-purple-army border-purple-400/50'
                      : 'liquid-glass-card border-white/90'
                  }`}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                    <img
                      src={activeSlideData.image}
                      alt={activeSlideData.featuredTitle}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />

                    {/* Floating Glass Spec Tag on product */}
                    <div
                      className={`absolute bottom-4 left-4 right-4 p-3 rounded-xl border flex items-center justify-between shadow-lg backdrop-blur-md ${
                        activeSlideData.isBtsTheme
                          ? 'bg-purple-950/80 border-purple-400/50 text-white'
                          : 'liquid-glass-card border-white/80 text-brand-dark'
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-widest block ${
                            activeSlideData.isBtsTheme ? 'text-purple-300' : 'text-brand-plum'
                          }`}
                        >
                          {activeSlideData.tagTitle}
                        </span>
                        <span className="text-xs font-serif italic">
                          {activeSlideData.tagSub}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          activeSlideData.isBtsTheme
                            ? 'bg-purple-600 text-white'
                            : 'bg-brand-blush/80 text-brand-plum'
                        }`}
                      >
                        {activeSlideData.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Secondary Detail Accent Card */}
                <div
                  className={`absolute -bottom-4 -left-4 sm:bottom-4 sm:left-2 z-20 p-4 rounded-2xl border shadow-xl max-w-[210px] hidden sm:block ${
                    activeSlideData.isBtsTheme
                      ? 'liquid-glass-purple-army border-purple-400/50 text-white'
                      : 'liquid-glass-card border-white/90 text-brand-dark'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm ${
                        activeSlideData.isBtsTheme
                          ? 'bg-purple-600 text-purple-100'
                          : 'bg-brand-plum text-brand-blush'
                      }`}
                    >
                      W
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">100% Bespoke</h4>
                      <p className="text-[10px] opacity-70">Handcrafted in studio</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-[10px]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="font-semibold ml-1 opacity-80">
                      {activeSlideData.accentReview}
                    </span>
                  </div>
                </div>

                {/* Floating Guarantee Pill */}
                <div
                  className={`absolute -top-3 right-2 sm:top-6 sm:right-6 z-20 px-3.5 py-2 rounded-full border shadow-md flex items-center gap-2 ${
                    activeSlideData.isBtsTheme
                      ? 'bg-purple-900/80 border-purple-400/50 text-purple-100'
                      : 'liquid-glass-pill border-white/80 text-brand-plum'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-rosegold" />
                  <span className="text-[11px] font-semibold">
                    {activeSlideData.badgeText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Jam Slider Thumbnail Strip & Controls */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-brand-plum/10 z-20">
            {/* 5-Product Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
              {heroSlides.map((slide, i) => {
                const isActive = i === currentSlide;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-300 text-left cursor-pointer border ${
                      isActive
                        ? slide.isBtsTheme
                          ? 'liquid-glass-purple-army border-purple-400 text-white'
                          : 'liquid-glass-card border-brand-plum/40 text-brand-plum'
                        : 'liquid-glass-pill opacity-70 hover:opacity-100 border-white/60 text-brand-gray'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        slide.isBtsTheme
                          ? 'bg-purple-500'
                          : isActive
                          ? 'bg-brand-plum'
                          : 'bg-brand-gray'
                      }`}
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider block">
                        0{i + 1}
                      </span>
                      <span className="text-xs font-medium whitespace-nowrap">
                        {slide.tagTitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Slider Arrow Navigation & Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-1.5 bg-brand-plum/10 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-brand-plum transition-all duration-500 rounded-full"
                  style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
                  }
                  aria-label="Previous Slide"
                  className="liquid-glass-pill w-11 h-11 rounded-full flex items-center justify-center text-brand-plum hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
                  aria-label="Next Slide"
                  className="liquid-glass-pill w-11 h-11 rounded-full flex items-center justify-center text-brand-plum hover:bg-white transition-all shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Builder.io Visual Page Builder Section */}
      <BuilderPage modelName="page" />

      {/* ==========================================
          SECTION 2: CURATED UNIVERSES (Auto-Swipe Carousel)
          ========================================== */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-rosegold/15 text-brand-plum text-[11px] font-bold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-plum animate-ping" />
                <span>Section 2 &bull; Curated Universes Auto-Slider</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark">
                Gifts designed for every{' '}
                <span className="italic font-normal text-brand-plum font-serif">deep bond.</span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-brand-gray max-w-md hidden lg:block">
                Explore three distinct artisan collections, each built with tactile depth, hand-assembled components, and personalized packaging.
              </p>
              {/* Category Carousel Dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategoryIndex(idx)}
                    aria-label={`Category Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeCategoryIndex === idx
                        ? 'w-7 bg-brand-plum'
                        : 'w-2 bg-brand-plum/20 hover:bg-brand-plum/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 01: HANDMADE */}
            <div
              onClick={() => navigateTo('handmade')}
              className={`category-card rounded-3xl p-8 flex flex-col justify-between min-h-[440px] group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border cursor-pointer ${
                activeCategoryIndex === 0
                  ? 'liquid-glass-card border-brand-plum/40 ring-2 ring-brand-plum/20 shadow-xl scale-[1.02]'
                  : 'liquid-glass-card border-white/80 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-plum bg-brand-blush/70 px-3 py-1.5 rounded-full">
                  Artisanal &bull; 01
                </span>
                <div className="w-12 h-12 rounded-full liquid-glass-pill flex items-center justify-center text-brand-plum group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="my-6 relative flex items-center justify-center">
                <div className="w-44 h-44 rounded-full bg-brand-softPink/30 blur-xl absolute -z-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="w-36 h-36 rounded-2xl liquid-glass-pill flex flex-col items-center justify-center p-4 border border-white/90 shadow-md group-hover:scale-110 transition-transform duration-500">
                  <Scissors className="w-10 h-10 text-brand-plum mb-2" />
                  <span className="text-[11px] font-serif text-brand-gray italic">
                    Crochet & Yarn
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-brand-plum font-normal mb-2">
                  Handmade Studio
                </h3>
                <p className="text-xs text-brand-gray leading-relaxed mb-4">
                  Forever flower bouquets, plush crochet keychains, hand-woven charms, and artisan keepsake cards.
                </p>
                <div className="text-xs font-bold text-brand-plum tracking-wider uppercase flex items-center gap-2 group-hover:text-brand-rosegold transition-colors">
                  <span>Explore Handmade</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CARD 02: BTS / BORAHAE */}
            <div
              onClick={() => navigateTo('bts')}
              className={`category-card rounded-3xl p-8 flex flex-col justify-between min-h-[440px] group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border relative overflow-hidden text-white cursor-pointer ${
                activeCategoryIndex === 1
                  ? 'liquid-glass-purple-army border-purple-300 ring-2 ring-purple-400/40 shadow-xl scale-[1.02]'
                  : 'liquid-glass-purple-army border-purple-400/40 opacity-90'
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(142,68,173,0.35),transparent_60%)] pointer-events-none" />

              <div className="flex items-start justify-between z-10">
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-200 bg-purple-900/80 px-3 py-1.5 rounded-full border border-purple-400/30">
                  BTS ARMY &bull; 02
                </span>
                <div className="w-12 h-12 rounded-full bg-purple-900/70 border border-purple-400/40 flex items-center justify-center text-purple-200 group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="my-6 relative flex items-center justify-center z-10">
                <div className="w-44 h-44 rounded-full bg-purple-600/30 blur-xl absolute -z-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="w-36 h-36 rounded-2xl bg-purple-950/70 border border-purple-400/50 flex flex-col items-center justify-center p-4 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-10 h-10 text-purple-300 mb-2" />
                  <span className="text-[11px] font-serif text-purple-200 italic">
                    I Purple You 💜
                  </span>
                </div>
              </div>

              <div className="z-10">
                <h3 className="font-serif text-2xl text-purple-100 font-normal mb-2">
                  For Every ARMY Heart
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                  Whale keepsakes, lyric shadow frames, purple flower boxes, and fandom memory collections for birthdays and concerts.
                </p>
                <div className="text-xs font-bold text-purple-200 tracking-wider uppercase flex items-center gap-2 group-hover:text-white transition-colors">
                  <span>Enter BTS Gallery</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CARD 03: COUPLES */}
            <div
              onClick={() => navigateTo('couples')}
              className={`category-card rounded-3xl p-8 flex flex-col justify-between min-h-[440px] group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border cursor-pointer ${
                activeCategoryIndex === 2
                  ? 'liquid-glass-card border-brand-plum/40 ring-2 ring-brand-plum/20 shadow-xl scale-[1.02]'
                  : 'liquid-glass-card border-white/80 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-plum bg-brand-blush/70 px-3 py-1.5 rounded-full">
                  Romantic &bull; 03
                </span>
                <div className="w-12 h-12 rounded-full liquid-glass-pill flex items-center justify-center text-brand-plum group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="my-6 relative flex items-center justify-center">
                <div className="w-44 h-44 rounded-full bg-rose-200/40 blur-xl absolute -z-10 group-hover:scale-125 transition-transform duration-500" />
                <div className="w-36 h-36 rounded-2xl liquid-glass-pill flex flex-col items-center justify-center p-4 border border-white/90 shadow-md group-hover:scale-110 transition-transform duration-500">
                  <Heart className="w-10 h-10 text-brand-plum mb-2" />
                  <span className="text-[11px] font-serif text-brand-gray italic">
                    Anniversary & Love
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-brand-plum font-normal mb-2">
                  Couples Edition
                </h3>
                <p className="text-xs text-brand-gray leading-relaxed mb-4">
                  Spotify soundwave frames, customized coordinate albums, romantic gift trunks, and date-night memory chests.
                </p>
                <div className="text-xs font-bold text-brand-plum tracking-wider uppercase flex items-center gap-2 group-hover:text-brand-rosegold transition-colors">
                  <span>View Couples Keepsakes</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          09. HANDMADE STORY (Editorial Section)
          ========================================== */}
      <section className="py-20 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-brand-cream via-brand-blush/30 to-brand-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden liquid-glass-card p-3 border border-white/90 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-brand-plumDeep to-brand-plum flex flex-col items-center justify-center text-center p-8 text-white relative">
                <div className="w-20 h-20 rounded-full border border-brand-rosegold/50 mb-4 p-1">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnKgF7iGg9ivUzAB2dyB91o4IL_bG-yfvdTBVgO_UbOifHoqpUqSvjt37LFRkms878zQBwyKCpzzaWi2-q7rScCKmi1YuDpGAuFEJR1pipii2ykUasq24MIdaNdKoGBfbyY6PdnC50BqMHFfUwNddPFIfKG8RT8Mefgzad0IKKlWOkHLXWu4fUabLze7XLBjeF-K9qSeoY0UYcFTIVvC12WWGS7Ga_aCjk6P9fLWxPoR1NV5pTZi4hLP5_kRWVnQ9prx4"
                    alt="Wishmint Motif"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-brand-rosegold font-sans font-semibold mb-2">
                  Craftsmanship
                </span>
                <h3 className="font-serif text-3xl font-light leading-snug">
                  "Handmade, made with heart."
                </h3>
                <div className="w-12 h-px bg-brand-rosegold/50 my-4" />
                <p className="text-xs text-brand-blush/80 max-w-xs font-sans">
                  No assembly line machinery. Every knot, fold, bow, and label is created with deliberate affection.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 sm:bottom-8 sm:-right-8 z-20 liquid-glass-card p-5 rounded-2xl border border-white/90 shadow-xl max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-brand-softPink/60 flex items-center justify-center text-brand-plum">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-plum">Zero Plastic Waste</h4>
                  <p className="text-[10px] text-brand-gray">Recyclable and keepsake grade</p>
                </div>
              </div>
              <p className="text-[11px] text-brand-dark/80 italic font-serif">
                "We preserve the sentiment by ensuring the gift outlives the day it was given."
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-3">
              Our Artisanal Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark leading-tight mb-6">
              Gifts that speak when words feel{' '}
              <span className="italic font-normal text-brand-plum font-serif">too small.</span>
            </h2>
            <p className="text-brand-gray text-base leading-relaxed mb-6 font-normal">
              In a world of mass-manufactured shortcuts, WISHMINT was founded on a simple truth: the most meaningful gifts carry human presence. Our artisans spend hours perfecting the delicate curvature of a crochet petal, hand-binding keepsake albums, and curating scent and touch profiles.
            </p>
            <p className="text-brand-gray text-base leading-relaxed mb-8 font-normal">
              When your recipient opens their WISHMINT package, they smell the fresh lavender sachet, feel the textured heavy-cotton ribbon, and see their own milestone preserved in custom gold-leaf typography.
            </p>

            <div className="flex items-center gap-8">
              <div>
                <span className="font-serif text-3xl font-medium text-brand-plum block tabular-nums">
                  14,800+
                </span>
                <span className="text-xs uppercase tracking-wider text-brand-gray font-sans">
                  Smiles Delivered
                </span>
              </div>
              <div className="w-px h-10 bg-brand-plum/15" />
              <div>
                <span className="font-serif text-3xl font-medium text-brand-plum block">
                  100%
                </span>
                <span className="text-xs uppercase tracking-wider text-brand-gray font-sans">
                  Handcrafted
                </span>
              </div>
              <div className="w-px h-10 bg-brand-plum/15" />
              <div>
                <span className="font-serif text-3xl font-medium text-brand-plum block tabular-nums">
                  4.9 / 5
                </span>
                <span className="text-xs uppercase tracking-wider text-brand-gray font-sans">
                  Love Score
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: SIGNATURE VAULT PRODUCT SLIDER
          ========================================== */}
      <section id="product-showcase" className="py-20 px-6 md:px-12 relative overflow-hidden bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <SignatureVaultSlider
            badge="Signature Showcase • Handcrafted Vault"
            title="The Signature Vault"
            subtitle="Explore our most cherished signature heirlooms, handcrafted with tactile depth and eternal affection."
          />
        </div>
      </section>

      {/* ==========================================
          SECTION 4: PERSONALIZED GIFTING OPTIONS
          ========================================== */}
      <section id="personalized-gifting-options" className="py-20 px-6 md:px-12 bg-white/60 relative">
        <div className="max-w-7xl mx-auto">
          <PersonalizedGiftingSection />
        </div>
      </section>

      {/* ==========================================
          SECTION 5: DIRECT WHATSAPP SUPPORT INTEGRATION
          ========================================== */}
      <section id="whatsapp-support" className="py-12 px-6 md:px-12 bg-brand-cream relative">
        <div className="max-w-7xl mx-auto">
          <WhatsAppSupportSection />
        </div>
      </section>

      {/* ==========================================
          SECTION 6: AI SMART GIFT FINDER
          ========================================== */}
      <section id="ai-gift-finder" className="py-20 px-6 md:px-12 bg-gradient-to-b from-brand-cream via-brand-blush/20 to-brand-cream relative">
        <div className="max-w-7xl mx-auto">
          <AiGiftFinder />
        </div>
      </section>

      {/* ==========================================
          ATELIER PILLARS (Why Wishmint)
          ========================================== */}
      <section className="py-20 px-6 md:px-12 bg-white/40 border-y border-brand-plum/10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="liquid-glass-pill p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex-none flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-brand-dark mb-1">Personalized</h4>
              <p className="text-xs text-brand-gray leading-relaxed">
                Names, songs, letters, and custom coordinates tailored to your bond.
              </p>
            </div>
          </div>

          <div className="liquid-glass-pill p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex-none flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-brand-dark mb-1">Handmade Studio</h4>
              <p className="text-xs text-brand-gray leading-relaxed">
                Crafted with tactile attention by dedicated crochet and paper artisans.
              </p>
            </div>
          </div>

          <div className="liquid-glass-pill p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex-none flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-brand-dark mb-1">Gift-Ready Box</h4>
              <p className="text-xs text-brand-gray leading-relaxed">
                Arrives with luxury satin bows and scented protection ready to unwrap.
              </p>
            </div>
          </div>

          <div className="liquid-glass-pill p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex-none flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-brand-dark mb-1">Made With Love</h4>
              <p className="text-xs text-brand-gray leading-relaxed">
                Every piece is verified for emotional impact before leaving our atelier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          17. EDITORIAL TESTIMONIALS
          ========================================== */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
              Unboxing Reactions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-dark">
              Real tears, <span className="italic font-normal text-brand-plum font-serif">pure joy.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-base text-brand-dark leading-relaxed italic mb-6">
                  "My boyfriend literally teared up when he scanned the Spotify code on our frame and heard our anniversary song play. The glass finish and ribbon are breathtaking in person."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-plum/10">
                <div className="w-10 h-10 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center font-bold text-xs">
                  AL
                </div>
                <div>
                  <h5 className="text-xs font-bold text-brand-plum">Alyssa L.</h5>
                  <span className="text-[10px] text-brand-gray">Couples Memory Frame · 2nd Anniversary</span>
                </div>
              </div>
            </div>

            <div className="liquid-glass-purple-army rounded-3xl p-8 border border-purple-400/40 text-white flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-1 text-purple-300 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-base text-purple-100 leading-relaxed italic mb-6">
                  "As an ARMY since 2017, this is the most tasteful, aesthetic BTS keepsake I own. The purple whale crochet sits right by my desk. Borahae Wishmint! 💜"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-purple-400/20">
                <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                  NK
                </div>
                <div>
                  <h5 className="text-xs font-bold text-purple-200">Namjoonie's Fan</h5>
                  <span className="text-[10px] text-purple-300/70">Borahae Starlight Whale</span>
                </div>
              </div>
            </div>

            <div className="liquid-glass-card rounded-3xl p-8 border border-white/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-base text-brand-dark leading-relaxed italic mb-6">
                  "The crochet tulip bouquet looked even better than fresh flowers, and my best friend gets to keep them forever. Shipped right on time for her graduation."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-plum/10">
                <div className="w-10 h-10 rounded-full bg-brand-rosegold text-brand-dark flex items-center justify-center font-bold text-xs">
                  ET
                </div>
                <div>
                  <h5 className="text-xs font-bold text-brand-plum">Elena T.</h5>
                  <span className="text-[10px] text-brand-gray">Handmade Pastel Crochet Bouquet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          18. INSTAGRAM / SOCIAL PROOF GRID
          ========================================== */}
      <section className="py-20 px-6 md:px-12 bg-white/30 border-t border-brand-plum/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-1">
                Community Feed
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-dark font-light">
                Tag <span className="text-brand-plum font-normal">@wishmint</span> to be featured
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="liquid-glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-plum flex items-center gap-2 w-fit hover:bg-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow Us</span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-2xl liquid-glass-card p-2 border border-white/80 group overflow-hidden relative">
              <div className="w-full h-full rounded-xl bg-pink-100 flex items-center justify-center text-brand-plum group-hover:scale-105 transition-transform duration-500">
                <Gift className="w-10 h-10 opacity-60" />
              </div>
              <div className="absolute inset-2 rounded-xl bg-brand-plum/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                <span>#WishmintGifts</span>
              </div>
            </div>
            <div className="aspect-square rounded-2xl liquid-glass-card p-2 border border-white/80 group overflow-hidden relative">
              <div className="w-full h-full rounded-xl bg-rose-100 flex items-center justify-center text-brand-plum group-hover:scale-105 transition-transform duration-500">
                <Flower2 className="w-10 h-10 opacity-60" />
              </div>
              <div className="absolute inset-2 rounded-xl bg-brand-plum/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                <span>#CrochetFloral</span>
              </div>
            </div>
            <div className="aspect-square rounded-2xl liquid-glass-purple-army p-2 border border-purple-400/40 group overflow-hidden relative">
              <div className="w-full h-full rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-200 group-hover:scale-105 transition-transform duration-500">
                <Sparkles className="w-10 h-10 opacity-80" />
              </div>
              <div className="absolute inset-2 rounded-xl bg-purple-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-purple-200 text-xs font-semibold">
                <span>#BorahaeForever</span>
              </div>
            </div>
            <div className="aspect-square rounded-2xl liquid-glass-card p-2 border border-white/80 group overflow-hidden relative">
              <div className="w-full h-full rounded-xl bg-amber-100 flex items-center justify-center text-brand-plum group-hover:scale-105 transition-transform duration-500">
                <Heart className="w-10 h-10 opacity-60" />
              </div>
              <div className="absolute inset-2 rounded-xl bg-brand-plum/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                <span>#CoupleMoments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          19. FINAL DRAMATIC PLUM CTA
          ========================================== */}
      <section className="py-28 px-6 md:px-12 relative overflow-hidden bg-brand-plum text-white text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,184,199,0.2),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand-rosegold/15 blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-brand-rosegold/50 mb-6 shadow-xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4zJ3wPXR6hN9x43PNbenJAgdvfd_OrVM2kqxpsftI56esiS3YoPhSc0ftMQT1zNiQsyfGLsBWY6FKLG-mstwAFzOFpO662dszaKW8NEd1TaMlmQmmjU4aVDaJ1RuDPApEIwhrUo6jqp787txsnlYlgyIY81b-Og-l3X1LOjIEGAyRyh4UvxRhpoh61hBAElxf2U2P7dlSP5Pll_3zXGqHPp-TL48vyP6DtXsQiNufG_vEM-xWU-FWmp2AqktYWcI5EuE"
              alt="Wishmint Emblem"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-6">
            Make someone's day a little <br />
            <span className="italic font-normal text-brand-blush font-serif">more unforgettable.</span>
          </h2>

          <p className="text-brand-blush/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Handcrafted personalized gifts made to turn ordinary moments into timeless keepsakes. Choose a design or start from scratch with our customizer.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('shop')}
              className="liquid-glass-card bg-white text-brand-plum font-sans text-xs font-bold uppercase tracking-widest px-9 py-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>Shop All Gifts</span>
              <ArrowRight className="w-4 h-4 text-brand-rosegold" />
            </button>
            <button
              onClick={() => navigateTo('product-details', 'bespoke-monogram-memory-shadowbox')}
              className="liquid-glass-plum border border-white/40 text-white font-sans text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              Customizer Studio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
