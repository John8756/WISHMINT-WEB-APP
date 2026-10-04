export interface WpPageStructure {
  id?: number | string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'publish' | 'draft';
  menuOrder?: number;
  inNavigation: boolean;
  navLabel?: string;
  featuredImage?: string;
  lastModified?: string;
}

export const DEFAULT_WP_PAGES: WpPageStructure[] = [
  {
    title: 'Home Atelier',
    slug: 'home',
    navLabel: 'Home',
    inNavigation: true,
    menuOrder: 1,
    status: 'publish',
    excerpt: 'Luxury personalized gifts, everlasting crochet bouquets, and artisanal keepsakes.',
    featuredImage: 'https://whitesmoke-wolverine-491981.hostingersite.com/wp-content/uploads/2026/09/couple-personalized-photo-bouquet.jpg',
    content: `
      <div class="wishmint-wp-page">
        <h2>Welcome to the WISHMINT Atelier</h2>
        <p>Every gift tells a chapter of your story. From bespoke handcrafted flower bouquets to timeless keepsakes, our artisan studio turns intimate memories into lifelong treasures.</p>
        <div class="features-grid">
          <div class="feature-item">
            <h3>Archival Craftsmanship</h3>
            <p>Heirloom-grade materials designed never to fade or decay over time.</p>
          </div>
          <div class="feature-item">
            <h3>Custom Engraving & Personalization</h3>
            <p>Names, dates, Spotify wave codes, and personalized photo polaroid charms clipped by hand.</p>
          </div>
          <div class="feature-item">
            <h3>White-Glove Presentation</h3>
            <p>Rigid matte gift box, velvet shredding, satin double-ribbon, and embossed botanical wax seal.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    title: 'About Our Atelier',
    slug: 'about',
    navLabel: 'About',
    inNavigation: true,
    menuOrder: 2,
    status: 'publish',
    excerpt: 'The philosophy and craftsmanship behind WISHMINT luxury gifting.',
    featuredImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    content: `
      <div class="wishmint-wp-page">
        <h2>The Art of Meaningful Keepsakes</h2>
        <p>Founded on the belief that ordinary moments deserve extraordinary tangible forms, WISHMINT is an artisanal gifting studio located in Kolkata, India. We handcraft bespoke pieces celebrating anniversaries, friendships, BTS Borahae connections, and life's sweetest milestones.</p>
        <p>Unlike mass-produced novelties, every single item that leaves our workbench is treated as a presentation piece. We fold each ribbon, hand-set every Polaroid print, and individually wax-seal each authenticity envelope with our signature botanical crest.</p>
        <h3>Our Core Atelier Commitments</h3>
        <ul>
          <li><strong>Zero Synthetic Waste:</strong> We prioritize everlasting dried botanicals, archival inks, and biodegradable protective linings.</li>
          <li><strong>Precision Personalization:</strong> Real human crafters review your customized dates and names to ensure flawless typographical alignment.</li>
          <li><strong>Delivery Assurance:</strong> If transit ever damages your presentation, our studio ships an express replacement within 24 hours at zero cost.</li>
        </ul>
      </div>
    `,
  },
  {
    title: 'Contact & Concierge Studio',
    slug: 'contact',
    navLabel: 'Contact',
    inNavigation: true,
    menuOrder: 3,
    status: 'publish',
    excerpt: 'Get in touch with our master artisan team for custom orders and concierge requests.',
    featuredImage: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1200',
    content: `
      <div class="wishmint-wp-page">
        <h2>We are here to assist your gifting vision</h2>
        <p>Have a custom idea for an anniversary, destination proposal, wedding bridal party, or bespoke fandom keepsake? Our atelier concierge works one-on-one with you to bring your concept to life.</p>
        <div class="contact-details">
          <p><strong>Email Concierge:</strong> concierge@wishmint.store</p>
          <p><strong>WhatsApp Support:</strong> +91 98765 43210 (Mon–Sat, 10 AM – 7 PM IST)</p>
          <p><strong>Atelier Studio:</strong> Salt Lake Sector V, Kolkata, West Bengal, India</p>
        </div>
      </div>
    `,
  },
  {
    title: 'Frequently Asked Questions',
    slug: 'faq',
    navLabel: 'FAQ',
    inNavigation: true,
    menuOrder: 4,
    status: 'publish',
    excerpt: 'Answers regarding crafting timelines, customization options, and shipping.',
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200',
    content: `
      <div class="wishmint-wp-page">
        <h2>Atelier Help & Common Questions</h2>
        <div class="faq-item">
          <h4>How long does crafting take?</h4>
          <p>Each personalized bouquet and custom keepsake requires 1–2 business days of handcrafting before express dispatch.</p>
        </div>
        <div class="faq-item">
          <h4>Are prices and invoices included in the box?</h4>
          <p>Never. Every WISHMINT order is prepared as a gift presentation. We never include invoice slips or price tags inside the package.</p>
        </div>
        <div class="faq-item">
          <h4>Do dried crochet flowers really last forever?</h4>
          <p>Yes! Our preserved botanicals and handcrafted crochet flora are specifically treated to resist fading and deterioration when kept away from direct humidity.</p>
        </div>
      </div>
    `,
  },
  {
    title: 'Shipping & Delivery Policy',
    slug: 'shipping-policy',
    navLabel: 'Shipping',
    inNavigation: false,
    menuOrder: 5,
    status: 'publish',
    excerpt: 'Information on domestic and express delivery across India.',
    content: `
      <div class="wishmint-wp-page">
        <h2>Shipping Standards & Timelines</h2>
        <p>All orders are dispatched via premium express air couriers (BlueDart / Delhivery / DTDC Express). You will receive immediate WhatsApp & SMS tracking links upon dispatch.</p>
        <ul>
          <li><strong>Metro Cities:</strong> 2–3 business days after handcrafting.</li>
          <li><strong>Rest of India:</strong> 3–5 business days after handcrafting.</li>
          <li><strong>Express Priority:</strong> 24–48 hour delivery available in select metro locations.</li>
        </ul>
      </div>
    `,
  },
  {
    title: 'Returns & Replacement Guarantee',
    slug: 'returns-policy',
    navLabel: 'Returns',
    inNavigation: false,
    menuOrder: 6,
    status: 'publish',
    excerpt: 'Our damaged-in-transit zero-hassle replacement guarantee.',
    content: `
      <div class="wishmint-wp-page">
        <h2>Replacement & Guarantee Policy</h2>
        <p>Because each keepsake is bespoke and personalized with custom names and photographs, personalized items are non-returnable once crafted. However, your peace of mind is unconditionally protected: if your order arrives damaged, defective, or contains any typographical mistake made by our atelier, we dispatch a complimentary priority replacement within 24 hours.</p>
      </div>
    `,
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    navLabel: 'Privacy',
    inNavigation: false,
    menuOrder: 7,
    status: 'publish',
    excerpt: 'How we safeguard customer photographs, personal details, and order data.',
    content: `
      <div class="wishmint-wp-page">
        <h2>Privacy & Archival Data Protection</h2>
        <p>We respect the intimate nature of the memories you entrust to us. Photos uploaded for custom bouquets and keepsakes are encrypted during transmission, accessed exclusively by the craftsman working on your order, and automatically purged from our production servers 30 days after successful delivery.</p>
      </div>
    `,
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms',
    navLabel: 'Terms',
    inNavigation: false,
    menuOrder: 8,
    status: 'publish',
    excerpt: 'Atelier terms of service, payment processing, and customer obligations.',
    content: `
      <div class="wishmint-wp-page">
        <h2>Atelier Terms of Service</h2>
        <p>By placing an order on WISHMINT, you agree that submitted personalization text and imagery are owned by you. Payment processing is encrypted and handled securely through Razorpay.</p>
      </div>
    `,
  },
];
