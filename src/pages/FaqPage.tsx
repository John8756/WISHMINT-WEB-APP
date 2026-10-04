import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ChevronDown, Sparkles, Search, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Customization & Personalization',
    q: 'How does the personalized Spotify soundwave work?',
    a: 'When you order, enter your favorite song and artist (or paste the Spotify track link). Our sound engineering studio generates the exact acoustic waveform and prints a scannable Spotify code directly onto the archival glass. When your recipient opens the Spotify app camera and points at the frame, the track immediately begins playing!',
  },
  {
    category: 'Customization & Personalization',
    q: 'Can I preview my custom foil monogram before it is stamped?',
    a: 'Yes! Our real-time simulator on the product page previews your font, foil tone, and ribbon letter. If you have unique date formats or coordinate requirements, our atelier reviews every typography plate before hot-stamping.',
  },
  {
    category: 'Handcrafting & Timelines',
    q: 'How long does handcrafting take before shipping?',
    a: 'Because our pieces involve hand-crocheted stems, hand-folded double-satin ribbons, and custom hot-foil stamping, standard crafting takes 2–3 business days. If you choose Priority Rush Delivery at checkout, your gift is placed at the front of the crafting queue within 24 hours.',
  },
  {
    category: 'Handcrafting & Timelines',
    q: 'Do you ship internationally?',
    a: 'Yes, WISHMINT ships worldwide with carbon-neutral tracked courier services. International delivery typically takes 5–8 business days following handcrafting completion.',
  },
  {
    category: 'Packaging & Gifting',
    q: 'Is the gift box presentation included, or is it an extra fee?',
    a: 'Every single WISHMINT order includes our signature luxury rigid gift box, plush interior cushioning, hand-tied satin ribbon bow, and lavender-scented wax seal at no additional charge. We never include invoices or pricing tags inside the package.',
  },
  {
    category: 'Returns & Guarantee',
    q: 'What happens if my frame or dome arrives damaged in transit?',
    a: 'We offer an unconditional 100% Transit Safe Arrival Guarantee. In the rare event an item is damaged by the courier, simply send a photo to our concierge within 48 hours of delivery and we will handcraft and dispatch a complimentary priority replacement immediately.',
  },
  {
    category: 'BTS ARMY Collection',
    q: 'Are the BTS Borahae keepsakes officially inspired and durable?',
    a: 'Our BTS Borahae collection is curated with highest artisanal reverence for the fandom. Each purple whale is hand-stitched from durable milk cotton that will never pill or fray, and the micro-LED cloche uses replaceable standard watch batteries.',
  },
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Customization & Personalization', 'Handcrafting & Timelines', 'Packaging & Gifting', 'Returns & Guarantee', 'BTS ARMY Collection'];

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== 'All' && faq.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
          Atelier Knowledge Base
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark mb-6">
          Frequently Asked <span className="italic font-normal text-brand-plum font-serif">Questions</span>
        </h1>

        {/* FAQ Search */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by topic..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === c
                  ? 'liquid-glass-plum text-white shadow-sm'
                  : 'liquid-glass-pill text-brand-gray hover:text-brand-plum'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="liquid-glass-card rounded-2xl border border-white/80 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-rosegold block mb-1">
                    {faq.category}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-medium text-brand-dark">
                    {faq.q}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center flex-none transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-brand-plum text-white' : 'text-brand-plum'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs text-brand-gray leading-relaxed border-t border-brand-plum/5">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
