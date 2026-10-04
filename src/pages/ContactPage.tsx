import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast, navigateTo } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [topic, setTopic] = useState('custom-inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been dispatched to our studio master! 💌');
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Contact Atelier' }]} />

      <div className="mb-12 text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-rosegold block mb-2">
          Customer Care & Studio Support
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark">
          We are here to help you{' '}
          <span className="italic font-normal text-brand-plum font-serif">craft memories.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 liquid-glass-card rounded-3xl p-8 sm:p-10 border border-white/90 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl font-light text-brand-dark">Message Received</h3>
              <p className="text-xs text-brand-gray max-w-md mx-auto leading-relaxed">
                Thank you, {name}. Our gifting concierge will respond to <strong>{email}</strong> within 12 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="liquid-glass-pill px-6 py-2.5 rounded-full text-xs font-semibold uppercase text-brand-plum cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl font-light text-brand-plum mb-6">
                Send a Note to Our Atelier
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Ross"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Topic of Inquiry
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold cursor-pointer"
                  >
                    <option value="custom-inquiry">Custom Monogram / Artwork</option>
                    <option value="order-status">Order Status & Tracking</option>
                    <option value="shipping-rush">Rush Delivery Request</option>
                    <option value="bts-collection">BTS Borahae Keepsake Inquiry</option>
                    <option value="bulk-corporate">Wedding / Corporate Bulk Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                    Order ID (if applicable)
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. WM-84920"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block mb-1.5">
                  Your Message or Special Request *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the occasion, special date, or custom request..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-brand-plum/20 text-xs focus:outline-none focus:border-brand-rosegold"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 px-8 rounded-full liquid-glass-plum text-white text-xs font-semibold uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Dispatch Message</span>
                <Send className="w-3.5 h-3.5 text-brand-rosegold" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Atelier Studio Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
            <h3 className="font-serif text-xl font-medium text-brand-plum mb-4">
              Atelier Coordinates
            </h3>

            <div className="space-y-4 text-xs text-brand-gray">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-rosegold flex-none mt-0.5" />
                <div>
                  <strong className="text-brand-dark block">The Wishmint Studio Atelier</strong>
                  <span>450 Post Street, Studio 6B</span> <br />
                  <span>San Francisco, CA 94102</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-rosegold flex-none mt-0.5" />
                <div>
                  <strong className="text-brand-dark block">Email Concierge</strong>
                  <span>concierge@wishmint-studio.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-rosegold flex-none mt-0.5" />
                <div>
                  <strong className="text-brand-dark block">Atelier Hotline</strong>
                  <span>+1 (800) 492-WISH (9474)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-rosegold flex-none mt-0.5" />
                <div>
                  <strong className="text-brand-dark block">Studio Hours</strong>
                  <span>Monday – Friday: 9:00 AM – 6:00 PM PST</span> <br />
                  <span>Saturday: 10:00 AM – 3:00 PM PST (Crafting Only)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Card */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-brand-rosegold/40 bg-brand-cream/80 shadow-md">
            <h4 className="font-serif text-lg font-medium text-brand-plum mb-2">
              Have a quick question?
            </h4>
            <p className="text-xs text-brand-gray leading-relaxed mb-4">
              Find immediate answers about our crafting timelines, Spotify scan setup, and rush delivery in our FAQ.
            </p>
            <button
              onClick={() => navigateTo('faq')}
              className="text-xs font-bold text-brand-rosegold hover:underline flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <span>Explore Common Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
