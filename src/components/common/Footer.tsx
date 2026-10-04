import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Instagram, Pin, Video, ArrowRight, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast('Welcome to the Wishmint Circle! Seasonal secret drops incoming. ✨');
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-dark text-white/80 pt-20 pb-12 px-6 md:px-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-plum/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-brand-rosegold/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Description */}
          <div className="lg:col-span-2">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 mb-5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-rosegold">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpujoSwK8y9BZL0X_BYMrW_gHzxhasuRuriUihLlKLqd1MLJW2BJXaTmlmOMblvFJre81zO6YvQieh97uy-7h1sGVUPVb9gIgdYWWsCIlfM-3ccKMz9j9g9wbUsEnby9QQrBEO_qJzslZVbTVMu6O4GGXUmLUCqJhLNFA3EI_WP7q3O1EPMbUiRh5OiHyLmiO9BOcihOtJRYN8lYgTduQKTbcjLqNwx8NQSJD3_IFy80-FAwkS0llUMdwXaWLlSuUQD5Y"
                  alt="Wishmint Monogram"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-serif tracking-widest text-2xl text-white font-medium">
                WISHMINT
              </span>
            </button>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm mb-6">
              An artisanal gifting atelier devoted to personalized keepsakes, everlasting crochet florals,
              and emotional storytelling for couples, best friends, and the global BTS ARMY family.
            </p>
            <div className="flex items-center gap-3 text-white/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-plum hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-plum hover:text-white transition-colors"
              >
                <Pin className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-plum hover:text-white transition-colors"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-brand-rosegold mb-4 font-sans">
              Curated Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-white/60">
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Personalized Gifts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('handmade')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Handmade Crochet Florals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('bts')}
                  className="hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>BTS ARMY Borahae</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('couples')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Couples & Anniversaries
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bespoke Gift Hampers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Links */}
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-brand-rosegold mb-4 font-sans">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-white/60">
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order Status & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customization & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shipping')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping & Turnaround
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('returns')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Returns & Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Atelier Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Secret Gifting Drops Newsletter */}
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-brand-rosegold mb-4 font-sans">
              Secret Gifting Drops
            </h5>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Receive exclusive seasonal drops, limited ARMY collections, and early customizer slots.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-2xl bg-white/10 border border-brand-rosegold/50 text-xs text-brand-blush">
                ✨ Thank you for subscribing to our atelier. Welcome to the circle!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-rosegold transition-colors"
                />
                <button
                  type="submit"
                  className="py-2.5 rounded-full bg-brand-rosegold text-brand-dark text-xs font-bold tracking-widest uppercase hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Join Atelier Circle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar with All Policy Navigation */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <p>© 2026 WISHMINT Studio. All rights reserved. Handcrafted with heart.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/60">
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigateTo('refund')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <button
              onClick={() => navigateTo('shipping')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shipping & Delivery
            </button>
            <button
              onClick={() => navigateTo('returns')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Returns & Exchange
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
