import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Truck, ShieldCheck, FileText, Lock, RotateCcw } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Shipping & Delivery' }]} />
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-14 border border-white/90 shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-4">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-plum">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-brand-gray leading-relaxed">
          Last revised: September 2026. Every WISHMINT creation is handcrafted on-demand in our studio atelier before careful hand-packaging into protective rigid presentation boxes.
        </p>

        <section className="space-y-2 pt-4">
          <h2 className="font-serif text-xl font-medium text-brand-dark">1. Handcrafting Lead Time</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            Standard bespoke crafting requires <strong>2 to 3 business days</strong> for ribbon folding, typography plate preparation, and gold foil hot-stamping. Priority orders placed with Rush Delivery are processed within 24 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-brand-dark">2. Domestic & Worldwide Rates</h2>
          <ul className="text-xs text-brand-gray space-y-1.5 list-disc pl-5">
            <li>Standard Domestic Tracked (3–5 business days): <strong>$8.50</strong> (Complimentary on orders $75+)</li>
            <li>Priority Atelier Rush & Air Courier (1–2 business days): <strong>$14.00</strong></li>
            <li>International Carbon-Neutral Courier (5–8 business days): <strong>$22.00</strong></li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-brand-dark">3. Presentation & Invoices</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            Because our items are predominantly intended as gifts, we never include price tags, packing slips, or receipts inside recipient boxes. Digital receipts are sent directly to the purchaser's email.
          </p>
        </section>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Returns & Exchange' }]} />
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-14 border border-white/90 shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-4">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-plum">
          Returns & Exchange Policy
        </h1>
        <p className="text-xs text-brand-gray leading-relaxed">
          Because personalized and bespoke keepsakes are custom hot-stamped with your individual names, dates, and audio soundwaves, custom items cannot be resold. However, our client satisfaction pledge is absolute.
        </p>

        <section className="space-y-2 pt-4">
          <h2 className="font-serif text-xl font-medium text-brand-dark">1. Transit Damage Guarantee</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            If your optical glass, cloche dome, or shadowbox suffers damage during courier handling, notify us within 48 hours with a photograph. We dispatch a priority remake free of charge.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-brand-dark">2. Non-Personalized Keepsakes</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            Non-customized items (such as standard crochet keyrings and unengraved bouquets) are eligible for return within <strong>14 days of delivery</strong> in unused, original presentation packaging.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-14 border border-white/90 shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-plum">
          Privacy Policy
        </h1>
        <p className="text-xs text-brand-gray leading-relaxed">
          At WISHMINT Studio, we hold your personal messages, anniversary dates, and recipient addresses with extreme confidentiality.
        </p>

        <section className="space-y-2 pt-4">
          <h2 className="font-serif text-xl font-medium text-brand-dark">1. Information Collection & Usage</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            We collect recipient names, delivery addresses, and custom message inscriptions solely to prepare and fulfill your ordered gift pieces. We never sell or lease customer information to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-brand-dark">2. Secure Payment Processing</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            All financial transactions are tokenized and processed via PCI-DSS Level 1 compliant gateways (Apple Pay, Stripe). Card details are never stored on our servers.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-14 border border-white/90 shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-plum">
          Terms & Conditions
        </h1>
        <p className="text-xs text-brand-gray leading-relaxed">
          Welcome to WISHMINT Studio. By accessing our artisanal portal and ordering our personalized products, you agree to the terms outlined herein.
        </p>

        <section className="space-y-2 pt-4">
          <h2 className="font-serif text-xl font-medium text-brand-dark">1. Custom Inscription Accuracy</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            Customers are responsible for verifying spellings, anniversary dates, and Spotify links prior to placing orders. Our studio will honor the exact characters entered in the personalization studio.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-brand-dark">2. Intellectual Property</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            All ribbon arrangements, proprietary frame soundwave layouts, and handmade crochet designs are original artistic creations of WISHMINT Studio.
          </p>
        </section>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Refund Policy' }]} />
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-14 border border-white/90 shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-full bg-brand-plum text-brand-blush flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-brand-plum">
          Refund Policy
        </h1>
        <p className="text-xs text-brand-gray leading-relaxed">
          We want you and your recipient to experience 100% delight. If an error is made by our studio (e.g., misspelled name or incorrect foil stamping compared to your order submission), a full immediate refund or expedited replacement is guaranteed.
        </p>
        <section className="space-y-2 pt-4">
          <h2 className="font-serif text-xl font-medium text-brand-dark">Refund Timeline</h2>
          <p className="text-xs text-brand-gray leading-relaxed">
            Approved refunds are credited to your original payment method within 3–5 banking business days.
          </p>
        </section>
      </div>
    </div>
  );
};
