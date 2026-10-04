export interface ExportResult {
  id?: number;
  name: string;
  slug: string;
  action: 'created' | 'updated';
  success: boolean;
  error?: string;
}

export const PRODUCTS_TO_EXPORT = [
  {
    name: 'Bespoke Monogram Memory Shadowbox',
    slug: 'bespoke-monogram-memory-shadowbox',
    category: 'custom',
    categoryLabel: 'Signature Keepsake',
    regular_price: '62.00',
    sale_price: '48.00',
    featured: true,
    short_description:
      'Pure satin ribbon monogram with hot-stamped gold foil text, heart accent, and archival glass framing.',
    description:
      '<p>A masterpiece of artisanal memory crafting. Each shadowbox is hand-curated in our studio with layered double-faced satin ribbon meticulously hand-formed into your chosen initial, accented with a plush velvet heart and personalized with your custom names, anniversary date, or personal inscription in lustrous gold foil.</p><ul><li>Dimensions: 25cm x 25cm x 4.5cm museum-depth frame</li><li>Solid wooden box frame with crystal-clear antireflective glass</li><li>High-thread count French satin ribbon and velvet heart</li><li>Includes Wishmint signature gift box and wax-sealed certificate</li></ul>',
    imageIds: [26, 20, 65],
    options: [
      {
        name: 'Frame Color',
        values: ['Atelier Cream White', 'Deep Plum Velvet', 'Warm Rose Oak'],
      },
      {
        name: 'Foil Stamping',
        values: ['Rose Gold Foil', 'Liquid Gold', 'Silver Shimmer'],
      },
    ],
  },
  {
    name: 'Handmade Pastel Crochet Bouquet',
    slug: 'handmade-pastel-crochet-bouquet',
    category: 'handmade',
    categoryLabel: 'Everlasting Floral',
    regular_price: '70.00',
    sale_price: '56.00',
    featured: true,
    short_description:
      'Everlasting hand-crocheted yarn bouquet featuring blush tulips, daisies, and delicate baby eucalyptus.',
    description:
      '<p>Unlike real flowers that wilt within days, these handcrafted yarn blossoms remain a permanent token of affection. Crocheted petal-by-petal using soft organic milk cotton yarn, wrapped in Korean matte parchment with an oversized satin bow.</p><ul><li>100% hypoallergenic organic milk cotton yarn</li><li>Flexible floral wire stems for effortless vase arrangement</li><li>Wrapped in imported Korean matte parchment paper</li><li>Scented with organic botanical lavender &amp; rose petal mist</li></ul>',
    imageIds: [25, 23, 32],
    options: [
      {
        name: 'Color Palette',
        values: ['Blush Pink & Milk Cream', 'Sunset Peach & Daisy', 'Lavender Mist & Lilac'],
      },
      {
        name: 'Bouquet Size',
        values: ['Classic (5 Stems)', 'Grand Luxe (9 Stems +$18)'],
      },
    ],
  },
  {
    name: 'BTS Mikrokosmos Memory Chest',
    slug: 'bts-mikrokosmos-memory-chest',
    category: 'bts',
    categoryLabel: 'BTS ARMY Borahae',
    regular_price: '89.00',
    sale_price: '74.00',
    featured: true,
    short_description:
      'Curated Borahae purple starlight dome with hand-crocheted whale, lyric scroll, and constellation accents.',
    description:
      '<p>Created with deepest reverence for the BTS ARMY bond. This illuminated starlight glass cloche encases an artisan-crocheted purple whale floating above star dust, complete with a personalized lyrics scroll from your favorite song (Mikrokosmos, Spring Day, Magic Shop, or Yet to Come).</p><ul><li>Hand-blown borosilicate glass cloche with solid dark walnut base</li><li>Micro LED fairy light filament integrated with touch switch</li><li>Artisan-stitched purple whale with iridescent whale fin accents</li><li>Comes in deep plum collector box with embossed Borahae logo</li></ul>',
    imageIds: [41, 44, 47, 42],
    options: [
      {
        name: 'Dome Accent',
        values: ['Starlight Purple LED Glow', 'Moonlight Silver Sparkle'],
      },
      {
        name: 'Song Lyric Scroll',
        values: ['Mikrokosmos', 'Magic Shop', 'Spring Day', 'Custom BTS Track'],
      },
    ],
  },
  {
    name: 'Personalized Acoustic Photo Frame',
    slug: 'personalized-acoustic-photo-frame',
    category: 'couples',
    categoryLabel: 'Couples Edition',
    regular_price: '65.00',
    sale_price: '49.00',
    featured: true,
    short_description:
      'Crystal acrylic & wooden frame featuring your photo, scannable Spotify code, and precision gold soundwave.',
    description:
      '<p>Commemorate the exact song that defines your relationship. Upload your favorite candid photo and specify any song on Spotify. We generate the scannable code and print your acoustic audio waveform onto archival glass with your names, special date, and anniversary coordinates.</p><ul><li>Dual-layer optical acrylic with polished beveled edges</li><li>Solid hardwood stand base with hidden magnetic support</li><li>Fully scannable Spotify code that opens the track instantly on any phone</li><li>High-definition UV pigment printing that will never fade</li></ul>',
    imageIds: [63, 69, 30],
    options: [
      {
        name: 'Frame Finish',
        values: ['Natural Warm Oak', 'Plum Walnut Finish', 'Matte White Gallery'],
      },
      {
        name: 'Waveform Style',
        values: ['Metallic Gold Wave', 'Minimalist Black Outline', 'Rose Gold Shimmer'],
      },
    ],
  },
  {
    name: 'Deluxe Velvet Gifting Chest',
    slug: 'deluxe-velvet-gifting-chest',
    category: 'custom',
    categoryLabel: 'The Bespoke Hamper',
    regular_price: '99.00',
    sale_price: '79.00',
    featured: true,
    short_description:
      'Plush velvet heirloom chest with personalized foil monogram, scented botanical sachet, and ribbon seal.',
    description:
      '<p>The pinnacle of thoughtful gifting. A handmade velvet chest hot-stamped with your recipient’s name in metallic gold. Inside, discover a hand-poured botanical wax tablet, customized ribbon charm, calligraphy love letter on deckled-edge cotton paper, and a miniature keepsake shadowbox.</p><ul><li>Rigid keepsake wood chest wrapped in Italian plush velvet</li><li>Personalized hot-stamped monogram foil plate</li><li>Includes botanical soy wax sachet, silk ribbon, and wax seal stamp</li><li>Ready to present without any additional wrapping needed</li></ul>',
    imageIds: [67, 70, 62],
    options: [
      {
        name: 'Chest Velvet Color',
        values: ['Signature Plum Rose', 'Blush Champagne', 'Midnight Amethyst'],
      },
      {
        name: 'Botanical Fragrance',
        values: ['French Lavender & Vanilla', 'English Rose & Bergamot', 'White Tea & Amber'],
      },
    ],
  },
  {
    name: 'Crochet Plush Heart Keyring & Bag Charm',
    slug: 'crochet-plush-heart-keyring',
    category: 'handmade',
    categoryLabel: 'Yarn Craft',
    regular_price: '24.00',
    sale_price: '18.00',
    featured: false,
    short_description:
      'Hand-stitched fluffy yarn heart with antique gold lobster clasp and personalized initial tag.',
    description:
      '<p>A portable daily reminder of your love. Carefully stitched with ultra-soft milk cotton yarn and stuffed with organic cloud fluff, fitted with a brushed gold clasp that easily attaches to bags, keys, or AirPods cases.</p><ul><li>Dimensions: 6.5cm x 6cm plush yarn heart</li><li>Heavy-duty alloy clasp in brushed antique gold</li><li>Laser-engraved mini wooden initial charm included</li></ul>',
    imageIds: [24, 68],
    options: [
      {
        name: 'Heart Color',
        values: ['Blush Rose', 'Plum Mauve', 'Butter Cream', 'Borahae Violet'],
      },
    ],
  },
  {
    name: 'Wax-Sealed Love Letter Keepsake',
    slug: 'wax-sealed-love-letter-keepsake',
    category: 'couples',
    categoryLabel: 'Sentiments',
    regular_price: '45.00',
    sale_price: '36.00',
    featured: false,
    short_description:
      'Custom calligraphy love letter printed on deckled cotton paper with authentic metallic wax stamp.',
    description:
      '<p>There is no gift more powerful than heartfelt words permanently preserved. Provide your custom letter or wedding vows; our atelier transcribes it onto 300gsm handmade deckled cotton rag paper with embossed gold borders, folded into an artisanal envelope sealed with custom melted wax.</p><ul><li>300gsm archival acid-free deckled edge cotton rag</li><li>Traditional hand-poured flexible seal wax (won’t crack in post)</li><li>Presented in a protective glassine sleeve and luxury gift portfolio</li></ul>',
    imageIds: [64, 65, 31],
    options: [
      {
        name: 'Wax Seal Motif',
        values: ['Wishmint Ribbon Monogram', 'Two Entwined Hearts', 'Botanical Rose'],
      },
      {
        name: 'Paper Tint',
        values: ['Vintage Cream Rag', 'Blush Petal Flecked'],
      },
    ],
  },
  {
    name: 'Borahae Purple Whale Starlight Keyring',
    slug: 'borahae-purple-whale-starlight-keyring',
    category: 'bts',
    categoryLabel: 'BTS ARMY Borahae',
    regular_price: '30.00',
    sale_price: '24.00',
    featured: false,
    short_description:
      'Pocket-sized crochet purple whale with starlight bead and 00:00 lyric charm.',
    description:
      '<p>Inspired by the iconic Whalien 52 and Mikrokosmos themes. This miniature plush whale is hand-stitched with deep purple and lavender cotton, accompanied by a purple crystal bead and your choice of member initial or favorite lyric quote.</p><ul><li>Dimensions: 7cm hand-crocheted yarn whale</li><li>Reinforced stainless alloy split ring with swivel clasp</li><li>Includes purple holographic gift bag and collectible photo card</li></ul>',
    imageIds: [48, 46, 45],
    options: [
      {
        name: 'Member Charm',
        values: ['OT7 Purple Heart', 'RM 🐨', 'Jin 🐹', 'SUGA 🐱', 'j-hope 🐿️', 'Jimin 🐥', 'V 🐻', 'Jung Kook 🐰'],
      },
    ],
  },
];

export async function executeWcProductMigration(
  wcUrl: string,
  consumerKey: string,
  consumerSecret: string
): Promise<ExportResult[]> {
  const cleanUrl = wcUrl.replace(/\/+$/, '');
  const authHeader =
    'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const headers = {
    Authorization: authHeader,
    'Content-Type': 'application/json',
    'User-Agent': 'Wishmint-Migration-Service/1.0',
  };

  // 1. Fetch categories
  const categoriesRes = await fetch(`${cleanUrl}/wp-json/wc/v3/products/categories?per_page=100`, {
    headers,
  });
  const existingCategories = (await categoriesRes.json()) || [];
  const categoryMap = new Map<string, number>();

  if (Array.isArray(existingCategories)) {
    existingCategories.forEach((cat: any) => {
      categoryMap.set(cat.slug.toLowerCase(), cat.id);
      categoryMap.set(cat.name.toLowerCase(), cat.id);
    });
  }

  const categoryLookup: Record<string, number> = {
    custom: categoryMap.get('custom') || categoryMap.get('all-gifts') || 30,
    handmade: categoryMap.get('handmade') || 24,
    bts: categoryMap.get('bts') || 25,
    couples: categoryMap.get('couples') || 26,
    'all-gifts': categoryMap.get('all-gifts') || 27,
  };

  // 2. Fetch existing products to avoid duplicates
  const existingProdsRes = await fetch(`${cleanUrl}/wp-json/wc/v3/products?per_page=100`, {
    headers,
  });
  const existingProducts = (await existingProdsRes.json()) || [];
  const existingBySlug = new Map<string, any>();
  if (Array.isArray(existingProducts)) {
    existingProducts.forEach((p: any) => {
      existingBySlug.set((p.slug || '').toLowerCase(), p);
    });
  }

  const results: ExportResult[] = [];

  for (const item of PRODUCTS_TO_EXPORT) {
    const catId = categoryLookup[item.category] || categoryLookup['all-gifts'] || 27;
    const catIds = [{ id: catId }, { id: categoryLookup['all-gifts'] || 27 }].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );

    const attributes = (item.options || []).map((opt, idx) => ({
      id: 0,
      name: opt.name,
      position: idx,
      visible: true,
      variation: false,
      options: opt.values,
    }));

    const images = item.imageIds.map((id) => ({ id }));

    const payload: any = {
      name: item.name,
      slug: item.slug,
      type: 'simple',
      status: 'publish',
      featured: item.featured || false,
      catalog_visibility: 'visible',
      description: item.description,
      short_description: item.short_description,
      regular_price: item.regular_price,
      sale_price: item.sale_price,
      manage_stock: false,
      stock_status: 'instock',
      categories: catIds,
      images,
      attributes,
    };

    const existing = existingBySlug.get(item.slug.toLowerCase());

    if (existing) {
      const updateRes = await fetch(`${cleanUrl}/wp-json/wc/v3/products/${existing.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (updateRes.ok) {
        const data = await updateRes.json();
        results.push({ id: data.id, name: data.name, slug: data.slug, action: 'updated', success: true });
      } else {
        const errText = await updateRes.text();
        results.push({ name: item.name, slug: item.slug, action: 'updated', success: false, error: errText });
      }
    } else {
      const createRes = await fetch(`${cleanUrl}/wp-json/wc/v3/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (createRes.ok) {
        const data = await createRes.json();
        results.push({ id: data.id, name: data.name, slug: data.slug, action: 'created', success: true });
      } else {
        const errText = await createRes.text();
        results.push({ name: item.name, slug: item.slug, action: 'created', success: false, error: errText });
      }
    }
  }

  return results;
}
