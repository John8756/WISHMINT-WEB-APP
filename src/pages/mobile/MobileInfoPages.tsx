import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';

export const MobileAboutPage: React.FC = () => {
  return (
    <div className="px-gutter pt-4 pb-36 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Our Atelier Story
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Bespoke Tactile Gifting
        </h1>
      </div>

      <div className="p-5 rounded-2xl liquid-glass-tier-2 border border-white/90 space-y-4 text-xs text-on-surface-variant leading-relaxed">
        <p>
          WISHMINT was founded in 2024 to restore deliberate human reverence to the art of gift-giving.
          Every bouquet is hand-crocheted from hypoallergenic organic milk cotton yarn, and every silk ribbon is tied with love.
        </p>
        <p>
          Unlike fresh flowers that wilt, our everlasting keepsakes, optical Spotify soundwave frames, and customized velvet hampers are made to be treasured on bedside tables for a lifetime.
        </p>
        <div className="p-3.5 rounded-xl liquid-glass-tier-1 border border-secondary-container/40 text-primary font-medium">
          ✨ 100% Recyclable Luxury Packaging • Zero Single-Use Plastic • Handcrafted in Pune
        </div>
      </div>
    </div>
  );
};

export const MobileContactPage: React.FC = () => {
  const { showToast } = useShop();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('💌 Message sent to our atelier concierge!');
  };

  return (
    <div className="px-gutter pt-4 pb-36 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Concierge Support
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Contact Atelier
        </h1>
      </div>

      <div className="p-5 rounded-2xl liquid-glass-tier-2 border border-white/90 mb-6">
        {sent ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-[36px] text-secondary mb-2">done</span>
            <p className="font-headline-sm text-sm text-primary">Thank you, {name}!</p>
            <p className="text-xs text-on-surface-variant mt-1">Our concierge will reply within 12 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-label-sm text-on-surface-variant block mb-1">Message</label>
              <textarea
                rows={3}
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="How can our atelier assist you?"
                className="w-full px-3 py-2 rounded-xl liquid-glass-tier-1 border border-outline-variant/40 text-xs font-headline-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-primary text-white text-xs font-label-md uppercase tracking-wider cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="p-4 rounded-2xl liquid-glass-tier-1 border border-white text-xs text-on-surface-variant space-y-1 text-center">
        <p className="font-semibold text-primary">Atelier Headquarters</p>
        <p>450 Post Street, Studio 6B</p>
        <p>Email: concierge@wishmint-studio.com</p>
        <p>Hotline: +1 (800) 492-WISH</p>
      </div>
    </div>
  );
};

export const MobileFaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Spotify soundwave frame work?',
      a: 'We print your custom track soundwave and a scannable Spotify code directly on the acrylic glass. Point your Spotify camera at the code to play the song immediately!',
    },
    {
      q: 'How long does handcrafting take?',
      a: 'Each piece takes 2–3 business days of careful artisan assembly before being dispatched in our signature gift box.',
    },
    {
      q: 'Is the luxury presentation gift box included?',
      a: 'Yes, every order includes our rigid gift box, velvet cushioning, silk satin ribbon bow, and scented wax seal with no extra fee.',
    },
    {
      q: 'What if an item is damaged during delivery?',
      a: 'We have a 100% Safe Transit Guarantee. Simply send us a photo and we will dispatch a free expedited replacement within 24 hours.',
    },
  ];

  return (
    <div className="px-gutter pt-4 pb-36 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Knowledge Base
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          Frequently Asked
        </h1>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="p-4 rounded-2xl liquid-glass-tier-1 border border-white">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left font-headline-sm text-sm text-primary font-semibold flex justify-between items-center cursor-pointer"
            >
              <span>{faq.q}</span>
              <span className="material-symbols-outlined text-[18px]">
                {openIdx === i ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {openIdx === i && (
              <p className="text-xs text-on-surface-variant leading-relaxed mt-2 pt-2 border-t border-outline-variant/20">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileLegalPage: React.FC<{ title: string; desc: string; content: string[] }> = ({
  title,
  desc,
  content,
}) => {
  return (
    <div className="px-gutter pt-4 pb-36 text-on-surface min-h-screen">
      <div className="text-center mb-6">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block font-bold mb-1">
          Atelier Policies
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          {title}
        </h1>
      </div>

      <div className="p-5 rounded-2xl liquid-glass-tier-2 border border-white/90 space-y-4 text-xs text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-primary">{desc}</p>
        {content.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>
    </div>
  );
};
