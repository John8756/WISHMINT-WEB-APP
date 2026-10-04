import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';
import { SwipeCarousel } from '../../components/mobile/SwipeCarousel';
import { SignatureVaultSlider } from '../../components/home/SignatureVaultSlider';
import { PersonalizedGiftingSection } from '../../components/common/PersonalizedGiftingSection';
import { AiGiftFinder } from '../../components/common/AiGiftFinder';
import { AnimatedAddToCartButton } from '../../components/common/AnimatedAddToCartButton';

export const MobileHomePage: React.FC = () => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, showToast, products } = useShop();

  // Dynamic Random WooCommerce Product Grid (3 cols x 2 rows = max 6 items)
  const [randomGridProducts, setRandomGridProducts] = useState<any[]>([]);

  useEffect(() => {
    const list = products && products.length > 0 ? products : PRODUCTS;
    // Prefer real WooCommerce products if available
    const wcItems = list.filter((p) => p.source === 'woocommerce');
    const pool = wcItems.length >= 6 ? wcItems : list;

    // Shuffle randomly on each load and take maximum 6 products
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setRandomGridProducts(shuffled);
  }, [products]);

  // 1. Hero Product Orbit Switcher Data
  const heroWorlds = {
    handmade: {
      title: 'Made for their <span class="italic font-normal underline decoration-secondary-container decoration-wavy underline-offset-4">moment</span>.',
      tagline: 'Ultra-tactile bespoke keepsakes hand-assembled with silk ribbons, pressed botanicals, and luminous memories.',
      price: '₹2,499',
      category: 'Handmade Sanctuary',
      edition: 'EDITION NO. 084',
      glowColor: '#fdbdd6',
      progress: '25%',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHHDOdS7k6dLoJzEzsumgolBK5jwp5swICYslgE5TsTXLY3vAz43KTgreDrxZBLWmu1SPJpQgHb479oU2qQ1fT3nS2f3K8dUxHYyfizS3i39CyVBnOEAkMLGO8KtBun8Jx2gZ4cjGAR-VGbYtKSXhPJexJabAD0EeiqTTjjcdWuM2rTKQT4AIAgw4pjm51X8kOKRRKGH33G0HTTTQkPYS6Aq6F9PQ8oeNRrOCrV-gfTYJV4Fyhd86-',
    },
    couples: {
      title: 'Eternal vows in <span class="italic font-normal underline decoration-secondary decoration-wavy underline-offset-4">velvet</span>.',
      tagline: 'Preserved anniversary calendar keepsakes, brass coordinates, and private vow scrolls.',
      price: '₹3,199',
      category: 'Couples Sanctuary',
      edition: 'EDITION NO. 112',
      glowColor: '#ffd8e6',
      progress: '50%',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZdCxG_Zq9mBbha7XAaBN__J6-2vvvkwEy6VV5OSKHnNdB9YRtlG6FHqw6OCCfdoNnSr6mkB-eq0B6pH2GqgNnbeK_YEZLdoKT0RFlqmSe701CVIg7cLfgLuQaMOsCdGQXrHuGxchwIsO8RI4RHl8q8G68Ub3tnMfOc2_CngOVxWjk2QPApQbUlmDzI55tRog9zRyySsIxA527Wn984hH47EPHzePMftjVQpAZmQppgIWVoil5djqp',
    },
    bts: {
      title: 'Borahae into the <span class="italic font-normal underline decoration-tertiary-fixed decoration-wavy underline-offset-4">galaxy</span>.',
      tagline: 'Dedicated to the ARMY heart: music boxes playing Mikrokosmos and illuminated purple whales.',
      price: '₹2,799',
      category: 'BTS Purple Universe',
      edition: 'EDITION NO. 007',
      glowColor: '#d8b9ff',
      progress: '75%',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyB5zxMI31lLIkdSmQDM6p8TaXFDF0g2qUSdl5oj3bsTv8tDi0neg3Khtj39KN3IMyxcwuAsOWVAykvS0KY4DbMsq_G3AcFSDG6YoGaYsa9rdzq3XIfoGU_2ZrXhWpGvPUNpC-KvJSY-5fGIY-sKIMo0zDLTW6Rtm5pvjLxfzMcQKEVg53ETyx7z12Lao3M0NgqwN1N6ir9fwRgx5npjtUkBlJlAkls2V8tIVmET0yU-zGp-aBA6ZY',
    },
    personalized: {
      title: 'Their names, <span class="italic font-normal underline decoration-primary-container decoration-wavy underline-offset-4">immortalized</span>.',
      tagline: '24-karat gold hot-foil debossing on French leatherette jewelry coffers and wax-sealed poems.',
      price: '₹3,499',
      category: 'Monogram Atelier',
      edition: 'EDITION NO. 240',
      glowColor: '#ffdad6',
      progress: '100%',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd48yz2ebA-lwK1m4VD6tw0eImpbf-rBYcQUgfJLuaTJveeYV2oepqhSzYO4ET9Ez0omgTBmk9Vk0-UQDCytgPilPLOyVYL8k2HNXM7RAc6NMfX7lk3yQgvPmw55_kxRGn6lrZEKNCP5LaJS8JqWPs3zqLTVxTNS3nNaUS76qABAXJ-NpbhqN1COx6UQsMXJ7eLdrwrbG4m5T6VQ40IDpQF9EBvDdNYzzBcMTpj1I-pSqNulW5UkSt',
    },
  };

  const [activeWorldKey, setActiveWorldKey] = useState<keyof typeof heroWorlds>('handmade');
  const [unfolded, setUnfolded] = useState(false);
  const [unboxing, setUnboxing] = useState(false);

  // Gallery state
  const galleryItems = [
    {
      title: 'Velvet Monogram Jewelry Vault',
      price: '₹2,899',
      desc: 'Hand-stitched Italian velvet with 24k gold leaf letter stamping and anti-tarnish interior suede.',
      badge: 'BESTSELLER',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd48yz2ebA-lwK1m4VD6tw0eImpbf-rBYcQUgfJLuaTJveeYV2oepqhSzYO4ET9Ez0omgTBmk9Vk0-UQDCytgPilPLOyVYL8k2HNXM7RAc6NMfX7lk3yQgvPmw55_kxRGn6lrZEKNCP5LaJS8JqWPs3zqLTVxTNS3nNaUS76qABAXJ-NpbhqN1COx6UQsMXJ7eLdrwrbG4m5T6VQ40IDpQF9EBvDdNYzzBcMTpj1I-pSqNulW5UkSt',
    },
    {
      title: 'Eternal Film Canister Keepsake',
      price: '₹1,699',
      desc: 'Pull-out vintage 35mm film reel containing 10 high-resolution memories in a brass lock casing.',
      badge: 'NEW ARRIVAL',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb-k4pqVtOCmliwRvSf6R1m8VrHH0qaUfn_-5wNdCiHoovYVKReEPEhIImUv67xZN61T-mWAVzpnQdO3KtturwckpslSSVb-Bfe9w_vHSSM48in8nd-9RvkrMEQDiMZgO4ebRIQXl5zbM5UNfyyV1zyamBRyZ4A3UZJ-O_yA7yQaIN1Dmje0bc8VwmAbI8ACRZfbPEIGrhX1ml00EkiEDm9-bJVqi-S4X2-n2fPBjH3CsFMfx7El_c',
    },
    {
      title: 'Floating Constellation Music Stand',
      price: '₹3,299',
      desc: 'Dual-tone illuminated acrylic stand engraved with the exact star map of your chosen evening.',
      badge: 'LIMITED DROP',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQtxbSE5RUzi0lhoKDSEbz0QGWp68te_z6-LsuMnqdXzb6PHj776ecBUe9NjKf226jDq76bln4kAdeUwbv_JBklXO1Mn39pQhPkCHB1CJc7VBSy2fsnNerTrA-skt2bBNHue2YzEdjCGeIdAk3tBVr5Tdy-Jd_JMX7AupWOKUj_JADXQ2AVL30jXhtpjUa2bbXyC2_p1u5P96-5JU99BSUvp8AqSz69pIXnR1gwC9Nete5PkJ_u91q',
    },
  ];
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Section 1: Hero World Continuous Auto-Swipe Slider (2s interval)
  useEffect(() => {
    const keys: (keyof typeof heroWorlds)[] = ['handmade', 'couples', 'bts', 'personalized'];
    const timer = setInterval(() => {
      setActiveWorldKey((prev) => {
        const nextIdx = (keys.indexOf(prev) + 1) % keys.length;
        return keys[nextIdx];
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Section 3: Signature Vault Gallery Continuous Auto-Slider (2s interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % galleryItems.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [galleryItems.length]);

  // Builder state
  const [builderColor, setBuilderColor] = useState<'plum' | 'cream' | 'violet'>('plum');
  const [builderName, setBuilderName] = useState('Aria & Kabir');
  const [builderScent, setBuilderScent] = useState('Rosewater Mist');

  const activeHeroData = heroWorlds[activeWorldKey];

  const handleUnbox = () => {
    setUnboxing(true);
    setTimeout(() => {
      setUnboxing(false);
      const featured = PRODUCTS[0];
      addToCart(featured, 1);
      showToast('🎁 Keepsake Unboxed & Added to Bag!');
    }, 700);
  };

  const handleFinalizeBox = () => {
    const bespokeProduct = PRODUCTS[4]; // Deluxe Velvet Gifting Chest
    addToCart(bespokeProduct, 1, {
      'Chest Velvet Color': builderColor === 'plum' ? 'Signature Plum Rose' : builderColor === 'cream' ? 'Blush Champagne' : 'Midnight Amethyst',
    }, {
      recipientName: builderName,
      customNote: `Aroma Infusion: ${builderScent}`,
    });
    showToast('✨ Keepsake Configured & Added to Bag!');
  };

  const scrollToGiftingOptions = () => {
    const el = document.getElementById('personalized-gifting-options');
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      });
    } else {
      navigateTo('shop');
    }
  };

  return (
    <div className="relative text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container selection:text-primary font-body-md text-body-md min-h-screen pb-40">
      {/* Ambient Light Orchestration & Winding Silk Ribbon Motif Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[90px] transition-all duration-1000"
          style={{ backgroundColor: activeHeroData.glowColor, opacity: 0.5 }}
        />
        <div className="absolute top-[35%] -right-24 w-80 h-80 rounded-full bg-tertiary-fixed-dim/40 blur-[100px] transition-all duration-1000" />
        <div className="absolute top-[70%] left-10 w-96 h-96 rounded-full bg-primary-fixed-dim/35 blur-[90px] transition-all duration-1000" />

        {/* Sinuous ribbon SVG vector path drifting throughout layout */}
        <svg
          className="absolute inset-0 w-full h-[4000px] opacity-25"
          fill="none"
          viewBox="0 0 400 4000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50,150 C180,240 380,480 220,780 C60,1080 340,1320 280,1650 C220,1980 -30,2250 150,2560 C330,2870 120,3200 240,3600 C360,4000 50,4200 180,4500"
            filter="blur(20px)"
            stroke="url(#ribbonGradientMobile)"
            strokeLinecap="round"
            strokeWidth="42"
          />
          <path
            d="M-50,150 C180,240 380,480 220,780 C60,1080 340,1320 280,1650 C220,1980 -30,2250 150,2560 C330,2870 120,3200 240,3600 C360,4000 50,4200 180,4500"
            stroke="url(#goldRimGradientMobile)"
            strokeDasharray="14 10"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="ribbonGradientMobile" gradientUnits="userSpaceOnUse" x1="0" x2="1" y1="0" y2="4000">
              <stop offset="0%" stopColor="#fdbdd6" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#ffd9e2" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#d8b9ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5a1332" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="goldRimGradientMobile" gradientUnits="userSpaceOnUse" x1="0" x2="1" y1="0" y2="4000">
              <stop offset="0%" stopColor="#e6c48f" />
              <stop offset="50%" stopColor="#f4b5cd" />
              <stop offset="100%" stopColor="#ffd9e2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 1. HERO — 'THE WISHMINT WORLD' (Mobile Optimized, Product-First) */}
      <section className="relative px-gutter pt-4 pb-8 overflow-hidden z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-space-md py-1.5 rounded-full liquid-glass-tier-1 text-primary mb-3">
            <span className="material-symbols-outlined text-[15px] text-secondary">auto_awesome</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              WISHMINT / PERSONALIZED GIFTING
            </span>
          </div>

          <h1
            className="font-display-hero-mobile text-display-hero-mobile text-primary tracking-tight mb-2 transition-all duration-500"
            dangerouslySetInnerHTML={{ __html: activeHeroData.title }}
          />

          <p className="text-on-surface-variant font-body-sm text-body-sm max-w-xs mb-5">
            {activeHeroData.tagline}
          </p>
        </div>

        {/* CENTERPIECE: 3D Multi-Layer Floating Gift Box Hamper Stage */}
        <div className="perspective-container relative w-full h-[360px] flex items-center justify-center my-1">
          <div className="absolute bottom-6 w-64 h-10 bg-primary/20 rounded-full blur-2xl transform scale-y-50" />

          {/* 3D Floating Hamper Pod */}
          <div className="preserve-3d relative w-72 h-80 rounded-xl liquid-glass-tier-2 p-5 flex flex-col items-center justify-between border-2 border-white/80 animate-float transition-all duration-700">
            {/* Top Silk Ribbon Knot */}
            <div className="absolute -top-6 -right-3 z-30 animate-float-delayed">
              <div className="relative w-16 h-16">
                <img
                  alt="Ribbon Emblem"
                  className="w-full h-full object-contain filter drop-shadow-md"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATe_IiCvfdhcdeoHxbfrbfrRDhfEVkUchan_WJZqJKJfXNE41h5lyv7_GTCqr5LRmj_sxQkZ0VG80LN4n5w-SvBKZZldLmS2smzjOEJYn-q1Auy4T4W9FKT8TuEVFmzRC2p1vhqFmPGCNPe4qQrW16-GQNR3_WhzaKETDNaup2brVTNTcXt05oRWDih7xFgi8LCdQtYgNDsvN7PJijeNi-Ef00Mc5cxDoRbH3M8cvQ_rcsc3Ibne-GGt44Z8mop_RzWw"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Frosted Glass Monogram Floating Badge */}
            <div className="absolute top-4 left-4 z-20 liquid-glass-tier-1 px-3 py-1 rounded-full text-primary font-headline-sm text-xs flex items-center space-x-1.5 border border-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="tracking-widest font-label-sm text-[10px]">
                {activeHeroData.edition}
              </span>
            </div>

            {/* Center Stage Graphic Frame */}
            <div className="relative w-full h-44 rounded-lg overflow-hidden mt-6 liquid-glass-tier-1 shadow-inner flex items-center justify-center p-2 group">
              <img
                className="w-full h-full object-cover rounded-md transition-transform duration-700 group-hover:scale-105"
                alt="Personalized Gifting Artwork"
                src={activeHeroData.img}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 shimmer-edge opacity-40 pointer-events-none" />

              {/* Interactive Floating Polaroid */}
              <div className="absolute -bottom-2 -left-2 w-20 h-24 bg-white p-1 rounded-sm shadow-xl transform -rotate-12 border border-outline-variant/40">
                <div className="w-full h-16 bg-surface-container overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Anniversary Polaroid"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf65E0IkmuH0r3psA8SGTKTbPZfKj9OzWIQAMfZM56BPBqZaXMtW0Hq4hP7yaehSMnvKcByGSM6CNf3_Wra1TY2HBU0s0Nr22BvGsFt0_I-tgrXPdLuIvFm7vOhiFXdydZa3lu7uS440QzfTjlhqbYMLUMjqi0CLkUHm1U-ezUZnjGbd6kVrsUVjLnUU86LPOeNbj5QgA99ZXKtBzHPHp-MKcu6DZ83gKwi3OgIje4grh68wrW76LA"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[8px] font-headline-sm text-center text-primary mt-1">forever. 24.10</p>
              </div>
            </div>

            {/* Product Details Bar */}
            <div className="w-full flex items-end justify-between z-20 pt-2 border-t border-outline-variant/30">
              <div>
                <span className="font-label-sm text-[10px] text-secondary tracking-wider uppercase block">
                  {activeHeroData.category}
                </span>
                <p className="font-title-lg text-title-lg text-primary font-bold">
                  {activeHeroData.price}
                </p>
              </div>
              <button
                onClick={handleUnbox}
                className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center space-x-1 shadow-md active:scale-95 transition-transform hover:shadow-lg cursor-pointer"
              >
                {unboxing ? (
                  <>
                    <span className="material-symbols-outlined text-[15px] animate-spin">refresh</span>
                    <span>Unwrapping...</span>
                  </>
                ) : (
                  <>
                    <span>Unbox</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="absolute top-12 left-4 w-6 h-6 rounded-full bg-secondary-fixed/60 blur-[2px] animate-pulse" />
          <div className="absolute bottom-16 right-4 w-8 h-8 rounded-full bg-tertiary-fixed-dim/50 blur-[3px] animate-float" />
        </div>

        {/* World Switcher Dock */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-1.5 p-1.5 rounded-full liquid-glass-tier-1 max-w-full overflow-x-auto no-scrollbar border border-white/60">
            {(['handmade', 'couples', 'bts', 'personalized'] as const).map((key) => {
              const labels = {
                handmade: 'Handmade',
                couples: 'Couples',
                bts: 'BTS Universe',
                personalized: 'Monogram',
              };
              const isSelected = activeWorldKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveWorldKey(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-label-md transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {labels[key]}
                </button>
              );
            })}
          </div>

          <div className="w-36 h-1 bg-outline-variant/30 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-primary-container transition-all duration-500 rounded-full"
              style={{ width: activeHeroData.progress }}
            />
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC RANDOM WOOCOMMERCE PRODUCT GRID (3x2) */}
      <section className="mt-space-xl px-gutter relative z-10" id="dynamic-random-products">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="font-label-sm text-label-sm text-[#9A7036] uppercase tracking-widest block font-bold">
              Newest Additions &bull; Real Atelier Vault
            </span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-[#4A234A] font-bold">
              Artisanal Edit
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-[#4A234A] hover:underline flex items-center gap-0.5 cursor-pointer pb-0.5"
          >
            <span>All Keepsakes</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

        {/* 2 Columns × 3 Rows Product Grid */}
        <div className="grid grid-cols-2 gap-3">
          {randomGridProducts.map((p) => {
            const wishlisted = isWishlisted(p.id);
            const displayPrice = Math.round(
              p.source === 'woocommerce'
                ? p.price
                : p.price < 150
                ? p.price * 82
                : p.price
            );

            return (
              <div
                key={p.id}
                onClick={() => navigateTo('product-details', p.slug)}
                className="rounded-xl bg-white/95 border border-[#EADBCE] shadow-2xs p-2 flex flex-col justify-between cursor-pointer hover:border-[#C9A46C] transition-all group"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-[#FAF7F2]/60 flex items-center justify-center">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                      style={{ objectFit: 'contain' }}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-[#814f65] shadow-2xs active:scale-90 transition-transform cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <span
                        className="material-symbols-outlined text-[13px]"
                        style={wishlisted ? { fontVariationSettings: "'FILL' 1", color: '#ba1a1a' } : {}}
                      >
                        {wishlisted ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  <span className="text-[8.5px] uppercase font-bold text-[#9A7036] tracking-wider block truncate">
                    {p.categoryLabel || 'Keepsake'}
                  </span>
                  <h3
                    className="font-serif text-[11px] font-bold text-[#4A234A] line-clamp-2 leading-tight mt-0.5 group-hover:underline"
                    title={p.name}
                  >
                    {p.name}
                  </h3>
                </div>

                <div className="pt-1.5 border-t border-[#EADBCE]/50 mt-1.5 flex items-center justify-between">
                  <span
                    className="font-bold tabular-nums tracking-tight text-[#4A234A] text-xs"
                    style={{ color: '#4A234A' }}
                  >
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  <AnimatedAddToCartButton
                    variant="icon"
                    onAdd={() => {
                      addToCart(p, 1);
                      showToast(`Added ${p.name} to Bag! 💐`);
                    }}
                    className="w-6 h-6"
                    title="Add to Bag"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More Button linking to Store */}
        <div className="mt-3.5 text-center">
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="w-full py-2.5 px-4 rounded-full bg-[#4A234A] hover:bg-[#341534] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span>Show More</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* 3. THE SIGNATURE VAULT (Horizontal Product Slider) */}
      <section className="mt-space-xl px-gutter relative z-10" id="signature-vault-slider">
        <SignatureVaultSlider
          badge="Section 3 • Horizontal Product Slider"
          title="The Signature Vault"
          subtitle="Swipe to explore our most coveted handcrafted keepsakes."
        />
      </section>

      {/* 4. PERSONALIZED GIFTING OPTIONS (CUSTOM PHOTO FRAME & WOOL ART CREATION) */}
      <section className="mt-space-xl px-gutter relative z-10" id="personalized-gifting-options">
        <PersonalizedGiftingSection />
      </section>

      {/* 6. AI SMART GIFT FINDER */}
      <section className="mt-space-xl px-gutter relative z-10" id="ai-gift-finder">
        <AiGiftFinder />
      </section>

      {/* 7. COUPLES "FLOATING MEMORIES" */}
      <section className="mt-space-xl px-gutter relative z-10">
        <div className="text-center mb-6">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold">
            Unconditional Ties
          </span>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            Made for the Two of You
          </h2>
        </div>

        <div className="relative w-full h-[320px] flex items-center justify-center">
          <div
            onClick={() => navigateTo('couples')}
            className="absolute left-1 top-4 w-44 rounded-xl liquid-glass-tier-2 p-2.5 shadow-xl transform -rotate-6 border border-white cursor-pointer"
          >
            <div className="w-full h-32 rounded-lg overflow-hidden mb-2">
              <img
                className="w-full h-full object-cover"
                alt="Our First Sunset"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJgIRZyENTUl6qyRUCxOZIvLLX8UJGcIirEf7CcuoriIdLSglQbaNpThapP7YkxveCMgeZGV_CXU3QC1KJ5J6icFSXYhOhRk77rUZTKYASQYGaYAKGG4PYWDeuxs0XnxglkfDoVhoariPDgql2gLIcF3LhJTSKTUSC7WerHJd8w00nzIxWKuM2TslEfDeGXYiOYLl9tuZUMprCWpCdAF_i6wQb-pBjYa3I26R30wFf_K5ZPGuPbrYv"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-headline-sm text-xs text-primary font-semibold text-center">
              40.7128° N, 74.0060° W
            </p>
            <p className="text-[9px] text-on-surface-variant text-center font-label-sm">Our First Sunset</p>
          </div>

          <div
            onClick={() => navigateTo('couples')}
            className="absolute right-2 top-14 w-48 rounded-xl liquid-glass-tier-2 p-2.5 shadow-2xl transform rotate-8 border border-secondary-container z-20 cursor-pointer"
          >
            <div className="w-full h-36 rounded-lg overflow-hidden mb-2">
              <img
                className="w-full h-full object-cover"
                alt="Anniversary Date Keepsake"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEMSRvuqZWplqI_Ae1tWtFdKQkMQVH_gewepBWg3sk6uLDOWFR7KVsnQ3yPX1k8AlNaetvqFh1LPdkr8E7H_4TvgX6bCC8-ALEnv5VMDMolACgvv0zlvF8GjFRQYOU2z_nq9hIDW-skc5D9McmxXe3CC1APJ9hZiQxGBEQslmEl06Mw-feVLl3-5osFzVTb5IZPtSJbDYPqZXD9taEVYCvXUZZEU3BKBdomdD_H8rZjp3pGMeNhkJO"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-headline-sm text-xs text-primary font-semibold text-center">
              October 24, 2021
            </p>
            <p className="text-[9px] text-secondary font-label-sm text-center">The Day You Said Yes</p>
          </div>
        </div>
      </section>

      {/* 8. "MOMENTS" HORIZONTAL STREAM & FLOATING QUOTES */}
      <section className="mt-space-xl px-gutter relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold block">
              Raw Emotions
            </span>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
              Unboxing Whispers
            </h3>
          </div>
          <span className="text-xs text-secondary font-label-sm">Real Keepsakes</span>
        </div>

        <SwipeCarousel autoSwipeInterval={4200} showIndicators={true}>
          <div className="flex-shrink-0 w-64 p-4 rounded-2xl liquid-glass-tier-1 border border-white">
            <div className="flex items-center space-x-1 text-primary mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="font-headline-sm text-sm text-primary italic mb-2">
              "She actually cried when she untied the ribbon."
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant">
              The scent of dried rosewater came out the moment the wax seal broke. Nothing on ordinary e-commerce compares.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-secondary">
              <span>Devansh K.</span>
              <span>1st Anniversary</span>
            </div>
          </div>

          <div className="flex-shrink-0 w-64 p-4 rounded-2xl liquid-glass-tier-1 border border-white">
            <div className="flex items-center space-x-1 text-primary mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="font-headline-sm text-sm text-primary italic mb-2">
              "He still keeps the acrylic photo prism on his office desk."
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Super high-end craftsmanship. Everyone at his work asks where he got it from.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-secondary">
              <span>Meera S.</span>
              <span>Birthday Vault</span>
            </div>
          </div>

          <div className="flex-shrink-0 w-64 p-4 rounded-2xl liquid-glass-tier-1 border border-white">
            <div className="flex items-center space-x-1 text-primary mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="font-headline-sm text-sm text-primary italic mb-2">
              "The Borahae music box is the pride of my ARMY shelf."
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Mikrokosmos sounds so peaceful and sweet. A true collector masterpiece.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-secondary">
              <span>Tanvi R.</span>
              <span>ARMY Vault</span>
            </div>
          </div>
        </SwipeCarousel>
      </section>

      {/* 9. CINEMATIC LUXURY FINALE & SEAMLESS FOOTER */}
      <section className="mt-space-xl px-gutter relative z-10">
        <div className="p-8 rounded-3xl bg-primary-container text-white text-center relative overflow-hidden shadow-2xl border border-primary-fixed/20">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-secondary-fixed/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-tertiary/40 blur-2xl" />

          <span className="w-12 h-12 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4 border border-white/20">
            <span className="material-symbols-outlined text-secondary-fixed text-2xl">card_giftcard</span>
          </span>

          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-white mb-2 leading-tight">
            Some moments deserve more than words.
          </h2>

          <p className="font-body-sm text-body-sm text-white/80 max-w-xs mx-auto mb-6">
            Begin crafting your bespoke gift hamper now. Every box is hand-packed, ribbon-tied, and dispatched across India within 48 hours.
          </p>

          <button
            onClick={scrollToGiftingOptions}
            className="w-full py-3.5 rounded-full bg-white text-primary font-label-lg text-label-lg flex items-center justify-center space-x-2 shadow-xl active:scale-95 transition-transform font-bold cursor-pointer"
          >
            <span>Find Their Gift Now</span>
            <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center space-x-4 mt-6 text-[11px] text-white/70 font-label-sm">
            <span className="flex items-center">
              <span className="material-symbols-outlined text-[13px] mr-1">verified_user</span>
              100% Safe Delivery
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="material-symbols-outlined text-[13px] mr-1">favorite</span>
              Handcrafted in Studio
            </span>
          </div>
        </div>
      </section>

      {/* EDITORIAL LIQUID GLASS FOOTER */}
      <footer className="mt-space-xl px-gutter pb-8 text-center text-on-surface-variant relative z-10">
        <div className="w-12 h-0.5 bg-outline-variant/40 mx-auto mb-6" />
        <p className="text-headline-sm font-headline-sm tracking-wider text-primary uppercase font-bold mb-2">
          WISHMINT
        </p>
        <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mx-auto mb-6">
          Curating tactile romanticism and bespoke memory capsules for intimate celebrations.
        </p>

        <div className="flex justify-center space-x-6 mb-6 text-sm font-label-md text-primary">
          <button onClick={() => navigateTo('account')} className="hover:underline">
            Track Order
          </button>
          <button onClick={() => navigateTo('contact')} className="hover:underline">
            Bespoke Inquiries
          </button>
          <button onClick={() => navigateTo('faq')} className="hover:underline">
            Care Guide
          </button>
        </div>

        <p className="text-[10px] font-label-sm text-outline">
          © 2025 WISHMINT ATELIER PVT LTD. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};
