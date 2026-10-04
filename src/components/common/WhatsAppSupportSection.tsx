import React from 'react';
import { MessageCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface WhatsAppSupportSectionProps {
  className?: string;
}

export const WhatsAppSupportSection: React.FC<WhatsAppSupportSectionProps> = ({
  className = '',
}) => {
  const whatsappUrl =
    'https://api.whatsapp.com/send?phone=919876543210&text=Hi%20Wishmint!%20I%20would%20like%20to%20chat%20about%20personalized%20gift%20making.';

  return (
    <div
      className={`w-full rounded-3xl liquid-glass-card border border-emerald-500/20 bg-gradient-to-br from-white/90 via-emerald-50/30 to-brand-cream/90 p-6 sm:p-8 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Decorative ambient emerald aura */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-brand-plum/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Content */}
        <div className="text-center md:text-left space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-[10px] font-bold uppercase tracking-wider shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Atelier Concierge &bull; Online Now</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-brand-dark font-medium leading-tight">
            Chat with us for personalized gift making!
          </h3>

          <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
            Need advice on frame sizes, yarn colors, song selection, or custom delivery timelines? Connect with our master artisans directly on WhatsApp for real-time guidance.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-1 text-[11px] text-brand-gray/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct Studio Support
            </span>
            <span>&bull;</span>
            <span>Typical reply in &lt; 5 mins</span>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex-none">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-white text-white" />
            </div>
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};
