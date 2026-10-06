import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { executeWcProductMigration } from './src/services/wcExportService';
import { PRODUCTS } from './src/data/products';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------
// SECURE SERVER-ONLY CONFIGURATION (Never exposed to frontend)
// -------------------------------------------------------------
const WOOCOMMERCE_URL = (
  process.env.WOOCOMMERCE_URL || 'https://whitesmoke-wolverine-491981.hostingersite.com'
).replace(/\/+$/, '');
const WOOCOMMERCE_CONSUMER_KEY = (process.env.WOOCOMMERCE_CONSUMER_KEY || '').trim();
const WOOCOMMERCE_CONSUMER_SECRET = (process.env.WOOCOMMERCE_CONSUMER_SECRET || '').trim();

// Administrative Security Token (Server-only guard for admin/sync endpoints)
const ADMIN_API_KEY = (
  process.env.ADMIN_API_KEY ||
  process.env.ADMIN_SECRET ||
  'wm_admin_sec_' + crypto.createHash('sha256').update(WOOCOMMERCE_URL + 'wishmint_admin_salt').digest('hex').slice(0, 16)
).trim();

// Persistent data directory for real orders and users
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory active session tokens mapped to user metadata
interface ActiveSession {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  expiresAt: number;
}
const ACTIVE_SESSIONS = new Map<string, ActiveSession>();

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: 'customer' | 'admin';
  memberSince: string;
  addresses: any[];
  createdAt: string;
}

function loadUsers(): StoredUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('[Storage] Error loading users:', err);
  }
  return [];
}

function saveUsers(users: StoredUser[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error saving users:', err);
  }
}

function loadOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('[Storage] Error loading orders:', err);
  }
  return [];
}

function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error saving orders:', err);
  }
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

function authenticateSession(req: express.Request): ActiveSession | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const session = ACTIVE_SESSIONS.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    ACTIVE_SESSIONS.delete(token);
    return null;
  }
  return session;
}

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const adminHeader = req.headers['x-admin-token'] as string;
  if (adminHeader && (adminHeader === ADMIN_API_KEY || adminHeader === process.env.ADMIN_API_KEY)) {
    return next();
  }
  const session = authenticateSession(req);
  if (session && session.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: 'Access Denied: Administrative authorization required for this endpoint.',
  });
}

/**
 * Decode HTML entities like &#038;, &amp;, &#8217;, etc.
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#0*38;|&amp;/gi, '&')
    .replace(/&#8217;|&#0*39;|&apos;/gi, "'")
    .replace(/&#8216;/gi, "'")
    .replace(/&#8220;|&#8221;|&quot;/gi, '"')
    .replace(/&#8211;/gi, '–')
    .replace(/&#8212;/gi, '—')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Strip HTML tags and decode HTML entities from text
 */
function stripHtml(html: string): string {
  if (!html) return '';
  const noTags = html.replace(/<[^>]*>?/gm, '').trim();
  return decodeHtmlEntities(noTags);
}

/**
 * Format raw WooCommerce product into complete, rich Product schema.
 * Note: Never includes fake reviews.
 */
function formatWcProduct(wc: any) {
  const primaryImage =
    wc.images && wc.images.length > 0
      ? wc.images[0].src
      : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800';

  const allImages =
    wc.images && wc.images.length > 0
      ? wc.images.map((img: any) => img.src)
      : [primaryImage];

  const rawWcCategories = Array.isArray(wc.categories) ? wc.categories : [];
  const validWcCategories = rawWcCategories.filter(
    (c: any) => c.slug !== 'uncategorized' && c.name?.toLowerCase() !== 'uncategorized'
  );
  const activeWcCategories = validWcCategories.length > 0 ? validWcCategories : rawWcCategories;

  const categoryIds = activeWcCategories.map((c: any) => c.id);
  const categorySlugs = activeWcCategories.map((c: any) => c.slug);
  const primaryCatObj = activeWcCategories[0];

  const category = primaryCatObj ? primaryCatObj.slug : 'handmade';
  const categoryLabel = primaryCatObj ? stripHtml(primaryCatObj.name) : 'Handmade Keepsake';

  const numericPrice = parseFloat(wc.price || wc.sale_price || wc.regular_price || '0');
  const numericRegularPrice = wc.regular_price ? parseFloat(wc.regular_price) : undefined;

  // Extract best narrative description
  const imageAltDescription = wc.images && wc.images.length > 0 && wc.images[0].alt ? wc.images[0].alt : '';
  const narrativeDescription =
    stripHtml(wc.description) ||
    stripHtml(wc.short_description) ||
    imageAltDescription ||
    'An exquisite personalized keepsake handcrafted with fine materials to preserve precious milestone memories.';

  const narrativeShortDescription =
    stripHtml(wc.short_description) ||
    (imageAltDescription ? imageAltDescription.slice(0, 140) + '...' : '') ||
    narrativeDescription.slice(0, 140);

  // Extract options / attributes
  const options =
    Array.isArray(wc.attributes) && wc.attributes.length > 0
      ? wc.attributes.map((attr: any) => ({
          name: attr.name,
          values: attr.options || [],
        }))
      : undefined;

  // Derive material specs / details
  const details = [
    'Handcrafted with archival keepsake materials & museum-quality finish',
    wc.dimensions && (wc.dimensions.length || wc.dimensions.width || wc.dimensions.height)
      ? `Dimensions: ${[wc.dimensions.length, wc.dimensions.width, wc.dimensions.height].filter(Boolean).join(' x ')} cm`
      : 'Artisanal tabletop and wall-mountable heirloom presentation',
    wc.weight ? `Weight: ${wc.weight} kg (solid keepsake construction)` : 'Curated premium protective gift packaging included',
    'Includes WISHMINT wax-sealed authenticity certificate',
  ];

  return {
    id: `wc-${wc.id}`,
    wcId: wc.id,
    name: wc.name,
    slug: wc.slug || `product-${wc.id}`,
    category,
    categoryLabel,
    categoryIds,
    categorySlugs,
    wcCategories: activeWcCategories.map((c: any) => ({
      id: c.id,
      name: stripHtml(c.name || ''),
      slug: c.slug,
    })),
    price: numericPrice,
    originalPrice: numericRegularPrice && numericRegularPrice > numericPrice ? numericRegularPrice : undefined,
    images: allImages,
    shortDescription: narrativeShortDescription,
    description: narrativeDescription,
    rawDescriptionHtml: wc.description || '',
    rating: parseFloat(wc.average_rating) || 5.0,
    reviewCount: wc.rating_count || 0,
    inStock: wc.stock_status === 'instock',
    stockStatus: wc.stock_status || 'instock',
    stockQuantity: wc.stock_quantity ?? null,
    isBestseller: wc.total_sales > 0 || wc.featured || false,
    craftingTime: '1–2 Days',
    customizable: true,
    customFields: {
      recipientName: true,
      anniversaryDate: true,
      customNote: true,
    },
    options,
    details,
    reviews: [], // Real reviews only - zero demo reviews in production
    onSale: wc.on_sale,
    priceHtml: wc.price_html,
    source: 'woocommerce',
  };
}

/**
 * Helper to fetch a single product by id or slug from WooCommerce
 */
async function fetchSingleWooCommerceProduct(identifier: string) {
  if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
    return null;
  }
  const cleanUrl = WOOCOMMERCE_URL;
  const authHeader =
    'Basic ' +
    Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');

  const headers = {
    Authorization: authHeader,
    'Content-Type': 'application/json',
    'User-Agent': 'Wishmint-Production-Server/1.0',
  };

  // 1. Try by numeric ID
  const isNumeric = /^(wc-)?\d+$/.test(identifier);
  if (isNumeric) {
    const numericId = identifier.replace('wc-', '');
    try {
      const response = await fetch(`${cleanUrl}/wp-json/wc/v3/products/${numericId}`, {
        method: 'GET',
        headers,
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Continue to slug lookup
    }
  }

  // 2. Try by exact slug
  try {
    const slugEndpoint = `${cleanUrl}/wp-json/wc/v3/products?slug=${encodeURIComponent(identifier)}`;
    const slugRes = await fetch(slugEndpoint, { method: 'GET', headers });
    if (slugRes.ok) {
      const products = await slugRes.json();
      if (Array.isArray(products) && products.length > 0) {
        return products[0];
      }
    }
  } catch {
    // Continue
  }

  return null;
}

/**
 * Helper to fetch products securely from WooCommerce REST API v3
 */
async function fetchWooCommerceFromBackend(categoryIdentifier?: string) {
  if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
    throw new Error('WooCommerce credentials not configured in server environment');
  }
  const cleanUrl = WOOCOMMERCE_URL;
  let endpoint = `${cleanUrl}/wp-json/wc/v3/products?per_page=100&status=publish`;

  if (categoryIdentifier && categoryIdentifier !== 'all') {
    let categoryId = /^\d+$/.test(categoryIdentifier) ? categoryIdentifier : null;

    if (!categoryId) {
      try {
        const categories = await fetchWooCommerceCategories();
        const found = categories.find(
          (c: any) =>
            c.slug.toLowerCase() === categoryIdentifier.toLowerCase() ||
            c.name.toLowerCase() === categoryIdentifier.toLowerCase()
        );
        if (found) {
          categoryId = String(found.id);
        }
      } catch (err) {
        console.warn('Error resolving category slug to ID:', err);
      }
    }

    if (categoryId) {
      endpoint += `&category=${encodeURIComponent(categoryId)}`;
    }
  }

  const authHeader =
    'Basic ' +
    Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'User-Agent': 'Wishmint-Production-Server/1.0',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce API Error (${response.status}): ${errorText || response.statusText}`);
  }

  const rawProducts = await response.json();
  return Array.isArray(rawProducts) ? rawProducts : [];
}

/**
 * Helper to fetch product categories securely from WooCommerce REST API v3
 */
async function fetchWooCommerceCategories() {
  if (!WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
    throw new Error('WooCommerce credentials not configured in server environment');
  }
  const cleanUrl = WOOCOMMERCE_URL;
  const endpoint = `${cleanUrl}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=false`;

  const authHeader =
    'Basic ' +
    Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'User-Agent': 'Wishmint-Production-Server/1.0',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce Categories API Error (${response.status}): ${errorText || response.statusText}`);
  }

  const rawCategories = await response.json();
  return Array.isArray(rawCategories) ? rawCategories : [];
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Runtime WordPress sync configuration (Server-only credentials)
  const wpConfig = {
    url: (process.env.WORDPRESS_URL || process.env.WOOCOMMERCE_URL || 'https://whitesmoke-wolverine-491981.hostingersite.com').replace(/\/+$/, ''),
    username: process.env.WORDPRESS_USERNAME || 'iliasmondal837',
    appPassword: (process.env.WORDPRESS_APP_PASSWORD || process.env.WP_APPLICATION_PASSWORD || '').trim(),
    consumerKey: WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: WOOCOMMERCE_CONSUMER_SECRET,
  };

  // Helper to build headers for WordPress REST API requests
  function getWpHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Wishmint-AIStudio-TwoWaySync/1.0',
    };

    if (wpConfig.appPassword) {
      const cleanPass = wpConfig.appPassword.replace(/\s+/g, '');
      headers['Authorization'] =
        'Basic ' + Buffer.from(`${wpConfig.username}:${cleanPass}`).toString('base64');
    } else if (wpConfig.consumerKey && wpConfig.consumerSecret) {
      headers['Authorization'] =
        'Basic ' + Buffer.from(`${wpConfig.consumerKey}:${wpConfig.consumerSecret}`).toString('base64');
    }

    return headers;
  }

  // Helper to format WordPress REST page into standard schema
  function formatWpPageObj(wpPage: any) {
    const rawContent = wpPage.content?.rendered || wpPage.content || '';
    const rawExcerpt = wpPage.excerpt?.rendered || wpPage.excerpt || '';
    const rawTitle = wpPage.title?.rendered || wpPage.title || 'Untitled Page';

    let featuredImage: string | undefined = undefined;
    if (wpPage._embedded && wpPage._embedded['wp:featuredmedia'] && wpPage._embedded['wp:featuredmedia'][0]) {
      featuredImage = wpPage._embedded['wp:featuredmedia'][0].source_url;
    }

    const inNav = ['home', 'about', 'contact', 'faq'].includes(wpPage.slug) || wpPage.menu_order > 0;

    return {
      id: wpPage.id,
      title: stripHtml(rawTitle),
      slug: wpPage.slug,
      content: rawContent,
      excerpt: stripHtml(rawExcerpt),
      status: wpPage.status || 'publish',
      menuOrder: wpPage.menu_order || 0,
      inNavigation: inNav,
      featuredImage,
      lastModified: wpPage.modified || wpPage.date,
    };
  }

  // Health check endpoint (Strictly boolean flags, no keys/secrets exposed)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      storeUrl: WOOCOMMERCE_URL,
      woocommerceConfigured: Boolean(WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET),
      wordpressConfigured: Boolean(wpConfig.url),
      wordpressHasAppPassword: Boolean(wpConfig.appPassword),
    });
  });

  // -------------------------------------------------------------
  // REAL SERVER-SIDE AUTHENTICATION ENDPOINTS (/api/auth/*)
  // -------------------------------------------------------------

  // POST /api/auth/signup - Real user registration with password hashing
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
      }

      if (String(password).length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
      }

      const users = loadUsers();
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists' });
      }

      const { hash, salt } = hashPassword(String(password));
      const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const newUser: StoredUser = {
        id: userId,
        name: String(name).trim(),
        email: cleanEmail,
        passwordHash: hash,
        passwordSalt: salt,
        role: 'customer',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);

      const token = crypto.randomBytes(32).toString('hex');
      ACTIVE_SESSIONS.set(token, {
        userId,
        email: cleanEmail,
        role: newUser.role,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const userOrders = loadOrders().filter((o) => o.customerEmail?.toLowerCase() === cleanEmail);

      return res.json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          memberSince: newUser.memberSince,
          addresses: newUser.addresses,
          orders: userOrders,
        },
      });
    } catch (err: any) {
      console.error('[Auth Signup Error]:', err);
      return res.status(500).json({ success: false, error: 'Internal server error during registration' });
    }
  });

  // POST /api/auth/login - Real secure authentication verification
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const users = loadUsers();
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!user || !verifyPassword(String(password), user.passwordHash, user.passwordSalt)) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      ACTIVE_SESSIONS.set(token, {
        userId: user.id,
        email: user.email,
        role: user.role,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });

      const userOrders = loadOrders().filter((o) => o.customerEmail?.toLowerCase() === cleanEmail);

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          memberSince: user.memberSince,
          addresses: user.addresses,
          orders: userOrders,
        },
      });
    } catch (err: any) {
      console.error('[Auth Login Error]:', err);
      return res.status(500).json({ success: false, error: 'Internal server error during login' });
    }
  });

  // GET /api/auth/me - Validate session and retrieve authentic user data
  app.get('/api/auth/me', (req, res) => {
    const session = authenticateSession(req);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const users = loadUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User account not found' });
    }

    const userOrders = loadOrders().filter((o) => o.customerEmail?.toLowerCase() === user.email.toLowerCase());

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        memberSince: user.memberSince,
        addresses: user.addresses,
        orders: userOrders,
      },
    });
  });

  // POST /api/auth/logout - Invalidate active session token
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      ACTIVE_SESSIONS.delete(token);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // PUT /api/auth/addresses - Save user address to persistent profile
  app.put('/api/auth/addresses', (req, res) => {
    const session = authenticateSession(req);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { addresses } = req.body || {};
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ success: false, error: 'Addresses must be an array' });
    }

    const users = loadUsers();
    const userIdx = users.findIndex((u) => u.id === session.userId);
    if (userIdx === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    users[userIdx].addresses = addresses;
    saveUsers(users);

    return res.json({ success: true, addresses });
  });

  // -------------------------------------------------------------
  // REAL ORDER CREATION & SERVER-SIDE PRICING ENDPOINTS (/api/orders/*)
  // -------------------------------------------------------------

  // POST /api/orders/create - Authoritative price calculation & real WooCommerce order creation
  app.post('/api/orders/create', async (req, res) => {
    try {
      const session = authenticateSession(req);
      const {
        items,
        shippingAddress,
        paymentMethod,
        customerEmail: clientEmail,
        couponCode,
      } = req.body || {};

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
      }

      if (
        !shippingAddress ||
        !shippingAddress.fullName ||
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.postalCode
      ) {
        return res.status(400).json({ success: false, error: 'Complete shipping address is required' });
      }

      const customerEmail = (
        session ? session.email : clientEmail || shippingAddress.email || 'guest@wishmint.in'
      ).trim();

      // 1. AUTHORITATIVE SERVER-SIDE PRICE LOOKUP (Frontend prices never trusted)
      let liveWcProducts: any[] = [];
      try {
        if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
          liveWcProducts = await fetchWooCommerceFromBackend();
        }
      } catch (err: any) {
        console.warn('[Orders API] Live WooCommerce product check error:', err.message);
      }

      let calculatedSubtotal = 0;
      const validatedLineItems: any[] = [];
      const wcApiLineItems: any[] = [];

      for (const item of items) {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

        // Find authoritative product in live WooCommerce
        let authoritativeProduct: any = null;
        const cleanWcId = String(item.productId || '').replace('wc-', '');
        const isNumeric = /^\d+$/.test(cleanWcId);

        if (isNumeric && liveWcProducts.length > 0) {
          authoritativeProduct = liveWcProducts.find((p) => String(p.id) === cleanWcId);
        }
        if (!authoritativeProduct && liveWcProducts.length > 0) {
          authoritativeProduct = liveWcProducts.find(
            (p) => p.slug === item.productSlug || p.name === item.productName
          );
        }

        // Fallback to verified catalog definition if store is offline
        if (!authoritativeProduct) {
          const { PRODUCTS } = await import('./src/data/products.js').catch(() => ({ PRODUCTS: [] }));
          authoritativeProduct =
            PRODUCTS.find(
              (p: any) =>
                p.id === item.productId || p.slug === item.productSlug || p.name === item.productName
            ) || PRODUCTS[0];
        }

        const unitPrice = parseFloat(
          authoritativeProduct.price ||
            authoritativeProduct.sale_price ||
            authoritativeProduct.regular_price ||
            '48.0'
        );
        const itemTotal = unitPrice * qty;
        calculatedSubtotal += itemTotal;

        const meta_data: Array<{ key: string; value: string }> = [];
        if (item.selectedOptions && typeof item.selectedOptions === 'object') {
          for (const [k, v] of Object.entries(item.selectedOptions)) {
            if (v) meta_data.push({ key: String(k), value: String(v) });
          }
        }
        if (item.personalization) {
          if (item.personalization.recipientName)
            meta_data.push({ key: 'Recipient Name', value: item.personalization.recipientName });
          if (item.personalization.anniversaryDate)
            meta_data.push({ key: 'Anniversary Date', value: item.personalization.anniversaryDate });
          if (item.personalization.customNote)
            meta_data.push({ key: 'Custom Note', value: item.personalization.customNote });
          if (item.personalization.uploadedPhotoName)
            meta_data.push({ key: 'Uploaded Photo', value: item.personalization.uploadedPhotoName });
          if (item.personalization.uploadedFileName)
            meta_data.push({ key: 'Uploaded Wool Pattern', value: item.personalization.uploadedFileName });
        }

        const numericWcId =
          authoritativeProduct.id && typeof authoritativeProduct.id === 'number'
            ? authoritativeProduct.id
            : isNumeric
            ? parseInt(cleanWcId, 10)
            : 0;

        validatedLineItems.push({
          productId: item.productId || `prod-${authoritativeProduct.id}`,
          productName: authoritativeProduct.name || item.productName || 'Handcrafted Keepsake',
          productImage:
            (authoritativeProduct.images &&
              authoritativeProduct.images[0] &&
              (authoritativeProduct.images[0].src || authoritativeProduct.images[0])) ||
            '',
          price: unitPrice,
          quantity: qty,
          total: itemTotal,
          personalization: item.personalization,
        });

        wcApiLineItems.push({
          product_id: numericWcId > 0 ? numericWcId : 0,
          name: authoritativeProduct.name || item.productName,
          quantity: qty,
          subtotal: itemTotal.toFixed(2),
          total: itemTotal.toFixed(2),
          meta_data,
        });
      }

      // Server-side discount calculation
      let calculatedDiscount = 0;
      const cleanCoupon = String(couponCode || '').trim().toUpperCase();
      if (cleanCoupon === 'WISH10') {
        calculatedDiscount = Math.round(calculatedSubtotal * 0.1 * 100) / 100;
      } else if (cleanCoupon === 'BORAHAE') {
        calculatedDiscount = Math.min(15.0, calculatedSubtotal);
      }

      // Server-side shipping calculation
      const calculatedShipping =
        cleanCoupon === 'FREESHIP' || calculatedSubtotal >= 75 || calculatedSubtotal === 0 ? 0.0 : 8.5;
      const calculatedFinalTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + calculatedShipping);

      // 2. DISPATCH TO REAL WOOCOMMERCE REST API (wp-json/wc/v3/orders)
      let realWcOrder: any = null;
      let orderCreationError: string | null = null;

      if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
        try {
          const cleanUrl = WOOCOMMERCE_URL;
          const authHeader =
            'Basic ' +
            Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');
          const nameParts = (shippingAddress.fullName || '').trim().split(' ');
          const firstName = nameParts[0] || 'Customer';
          const lastName = nameParts.slice(1).join(' ') || 'Wishmint';

          const wcPayload = {
            payment_method: paymentMethod || 'cod',
            payment_method_title:
              paymentMethod === 'apple-pay'
                ? 'UPI / Apple Pay'
                : paymentMethod === 'card'
                ? 'Credit / Debit Card'
                : 'Cash on Delivery',
            set_paid: false,
            status: 'processing',
            billing: {
              first_name: firstName,
              last_name: lastName,
              address_1: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state || '',
              postcode: shippingAddress.postalCode,
              country: shippingAddress.country === 'India' || !shippingAddress.country ? 'IN' : shippingAddress.country,
              email: customerEmail,
              phone: shippingAddress.phone || '9876543210',
            },
            shipping: {
              first_name: firstName,
              last_name: lastName,
              address_1: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state || '',
              postcode: shippingAddress.postalCode,
              country: shippingAddress.country === 'India' || !shippingAddress.country ? 'IN' : shippingAddress.country,
            },
            line_items: wcApiLineItems,
            customer_note:
              validatedLineItems
                .map((i) => (i.personalization?.recipientName ? `[For ${i.personalization.recipientName}]` : ''))
                .filter(Boolean)
                .join(' ') || undefined,
          };

          const wcRes = await fetch(`${cleanUrl}/wp-json/wc/v3/orders`, {
            method: 'POST',
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
              'User-Agent': 'Wishmint-RealOrderEngine/1.0',
            },
            body: JSON.stringify(wcPayload),
          });

          if (wcRes.ok) {
            realWcOrder = await wcRes.json();
            console.log(`[WooCommerce Order Created]: Real Order #${realWcOrder.id} confirmed!`);
          } else {
            const errBody = await wcRes.text();
            console.warn(`[WooCommerce Order Warning]: HTTP ${wcRes.status} from WooCommerce: ${errBody}`);
            orderCreationError = `WooCommerce returned HTTP ${wcRes.status}`;
          }
        } catch (err: any) {
          console.warn(`[WooCommerce Order Network Warning]:`, err.message);
          orderCreationError = err.message;
        }
      }

      // 3. PERSIST REAL ORDER IN DATABASE
      const orders = loadOrders();
      const finalOrderId = realWcOrder ? `WC-${realWcOrder.id}` : `ORD-${Date.now()}`;
      const trackingNumber = realWcOrder ? `WC-TRACK-${realWcOrder.id}` : `WM-IN-${Date.now().toString().slice(-8)}`;

      const savedOrder = {
        id: finalOrderId,
        wcOrderId: realWcOrder ? realWcOrder.id : undefined,
        isRealWooCommerceOrder: Boolean(realWcOrder),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        createdAt: new Date().toISOString(),
        status: realWcOrder ? realWcOrder.status || 'processing' : 'Processing',
        customerEmail,
        items: validatedLineItems,
        subtotal: calculatedSubtotal,
        discount: calculatedDiscount,
        shipping: calculatedShipping,
        total: realWcOrder ? parseFloat(realWcOrder.total) || calculatedFinalTotal : calculatedFinalTotal,
        currency: 'INR',
        shippingAddress: {
          fullName: shippingAddress.fullName,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India',
        },
        paymentMethod:
          paymentMethod === 'apple-pay'
            ? 'UPI / Apple Pay'
            : paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : 'Cash on Delivery',
        estimatedDelivery: '3–4 Business Days (Handcrafted Delivery)',
        trackingNumber,
        syncNote: realWcOrder
          ? 'Registered directly in Hostinger WooCommerce store'
          : orderCreationError || 'Stored securely in order database',
      };

      orders.unshift(savedOrder);
      saveOrders(orders);

      return res.json({
        success: true,
        order: savedOrder,
        isRealWooCommerce: Boolean(realWcOrder),
        wcOrderId: realWcOrder ? realWcOrder.id : null,
      });
    } catch (err: any) {
      console.error('[Create Order Error]:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to process order' });
    }
  });

  // GET /api/orders - Get orders for authenticated user
  app.get('/api/orders', (req, res) => {
    const session = authenticateSession(req);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const orders = loadOrders();
    const userOrders = orders.filter((o) => o.customerEmail?.toLowerCase() === session.email.toLowerCase());
    return res.json({ success: true, orders: userOrders });
  });

  // GET /api/orders/:id - Get single order details
  app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const orders = loadOrders();
    const order = orders.find((o) => o.id === id || String(o.wcOrderId) === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    return res.json({ success: true, order });
  });

  // -------------------------------------------------------------
  // SECURE WORDPRESS REST API ENDPOINTS (/api/wp/*)
  // Protected with real authorization guards where appropriate
  // -------------------------------------------------------------

  // GET /api/wp/status - Check connection to WordPress and sync health (No secrets returned)
  app.get('/api/wp/status', async (req, res) => {
    try {
      const response = await fetch(`${wpConfig.url}/wp-json/wp/v2/pages?per_page=1`, {
        headers: getWpHeaders(),
      });

      const canWriteCheck = Boolean(wpConfig.appPassword);

      res.json({
        connected: response.ok || response.status === 401,
        storeUrl: wpConfig.url,
        username: wpConfig.username,
        hasAppPassword: Boolean(wpConfig.appPassword),
        woocommerceConfigured: Boolean(wpConfig.consumerKey && wpConfig.consumerSecret),
        syncMode: canWriteCheck ? 'live-wordpress-rest' : 'cached-fallback',
        message: canWriteCheck
          ? 'WordPress Application Password active. Two-way sync fully operational.'
          : 'Connected to WordPress. Enter your Application Password in the Sync Panel for write sync.',
      });
    } catch (err: any) {
      res.json({
        connected: false,
        storeUrl: wpConfig.url,
        username: wpConfig.username,
        hasAppPassword: Boolean(wpConfig.appPassword),
        syncMode: 'cached-fallback',
        error: err.message,
      });
    }
  });

  // GET /api/wp/pages - Public read of published pages from WordPress
  app.get('/api/wp/pages', async (req, res) => {
    try {
      const endpoint = `${wpConfig.url}/wp-json/wp/v2/pages?per_page=100&_embed`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getWpHeaders(),
      });

      if (response.ok) {
        const rawPages = await response.json();
        if (Array.isArray(rawPages) && rawPages.length > 0) {
          const formatted = rawPages.map(formatWpPageObj);
          return res.json({
            success: true,
            source: 'wordpress-live',
            count: formatted.length,
            pages: formatted,
          });
        }
      }

      res.json({
        success: true,
        source: 'local-cached',
        count: 0,
        pages: [],
      });
    } catch (err: any) {
      console.error('[WordPress Proxy Error]:', err.message);
      res.status(502).json({
        success: false,
        error: 'Failed to retrieve pages from WordPress',
        message: err.message,
      });
    }
  });

  // GET /api/wp/pages/:slug - Public read of single page
  app.get('/api/wp/pages/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const endpoint = `${wpConfig.url}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getWpHeaders(),
      });

      if (response.ok) {
        const pages = await response.json();
        if (Array.isArray(pages) && pages.length > 0) {
          return res.json({
            success: true,
            source: 'wordpress-live',
            page: formatWpPageObj(pages[0]),
          });
        }
      }

      res.status(404).json({
        success: false,
        error: `Page "${slug}" not found in WordPress`,
      });
    } catch (err: any) {
      res.status(502).json({
        success: false,
        error: err.message,
      });
    }
  });

  // POST /api/wp/sync-all - SECURED: Push page structures to WordPress
  app.post('/api/wp/sync-all', requireAdminAuth, async (req, res) => {
    try {
      const { pages } = req.body;
      const pagesToSync = Array.isArray(pages) && pages.length > 0 ? pages : [];

      const syncResults: any[] = [];
      let successCount = 0;

      for (const page of pagesToSync) {
        try {
          const checkRes = await fetch(
            `${wpConfig.url}/wp-json/wp/v2/pages?slug=${encodeURIComponent(page.slug)}`,
            { headers: getWpHeaders() }
          );

          let targetUrl = `${wpConfig.url}/wp-json/wp/v2/pages`;
          let method = 'POST';

          if (checkRes.ok) {
            const existing = await checkRes.json();
            if (Array.isArray(existing) && existing.length > 0) {
              targetUrl = `${wpConfig.url}/wp-json/wp/v2/pages/${existing[0].id}`;
              method = 'POST';
            }
          }

          const wpPayload = {
            title: page.title,
            slug: page.slug,
            content: page.content,
            excerpt: page.excerpt || '',
            status: page.status || 'publish',
            menu_order: page.menuOrder || 0,
          };

          const postRes = await fetch(targetUrl, {
            method,
            headers: getWpHeaders(),
            body: JSON.stringify(wpPayload),
          });

          if (postRes.ok) {
            const created = await postRes.json();
            successCount++;
            syncResults.push({
              slug: page.slug,
              id: created.id,
              status: 'synced',
              title: page.title,
            });
          } else {
            const errData = await postRes.json().catch(() => ({}));
            syncResults.push({
              slug: page.slug,
              status: 'failed',
              error: errData.message || postRes.statusText,
              code: errData.code,
            });
          }
        } catch (pageErr: any) {
          syncResults.push({
            slug: page.slug,
            status: 'error',
            error: pageErr.message,
          });
        }
      }

      if (successCount > 0) {
        return res.json({
          success: true,
          syncedCount: successCount,
          pages: pagesToSync,
          message: `Successfully synchronized ${successCount} pages to WordPress!`,
          details: syncResults,
        });
      }

      const authFailed = syncResults.some((r) => r.code === 'rest_cannot_create' || r.code === 'invalid_username');

      return res.json({
        success: false,
        syncedCount: 0,
        pages: pagesToSync,
        message: authFailed
          ? 'WordPress REST API requires an Application Password for page write access.'
          : 'Could not sync pages to WordPress.',
        details: syncResults,
      });
    } catch (err: any) {
      console.error('[WordPress Sync Error]:', err.message);
      res.status(502).json({
        success: false,
        error: 'Failed to complete sync to WordPress',
        message: err.message,
      });
    }
  });

  // POST /api/wp/pages - SECURED: Create page in WordPress
  app.post('/api/wp/pages', requireAdminAuth, async (req, res) => {
    try {
      const page = req.body;
      if (!page || !page.title || !page.slug) {
        return res.status(400).json({ success: false, error: 'Title and slug are required' });
      }

      const wpPayload = {
        title: page.title,
        slug: page.slug,
        content: page.content || '',
        excerpt: page.excerpt || '',
        status: page.status || 'publish',
        menu_order: page.menuOrder || 0,
      };

      const response = await fetch(`${wpConfig.url}/wp-json/wp/v2/pages`, {
        method: 'POST',
        headers: getWpHeaders(),
        body: JSON.stringify(wpPayload),
      });

      if (response.ok) {
        const created = await response.json();
        return res.json({
          success: true,
          page: formatWpPageObj(created),
          message: `Page "${page.title}" created in WordPress!`,
        });
      }

      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        error: errData.message || 'Failed to save page to WordPress',
      });
    } catch (err: any) {
      res.status(502).json({ success: false, error: err.message });
    }
  });

  // DELETE /api/wp/pages/:id - SECURED: Delete page from WordPress
  app.delete('/api/wp/pages/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`${wpConfig.url}/wp-json/wp/v2/pages/${id}?force=true`, {
        method: 'DELETE',
        headers: getWpHeaders(),
      });

      if (response.ok) {
        return res.json({ success: true, message: `Page #${id} deleted from WordPress` });
      }

      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        error: errData.message || 'Failed to delete page',
      });
    } catch (err: any) {
      res.status(502).json({ success: false, error: err.message });
    }
  });

  // GET /api/wp/navigation - Dynamic navigation menu
  app.get('/api/wp/navigation', async (req, res) => {
    try {
      const response = await fetch(`${wpConfig.url}/wp-json/wp/v2/pages?per_page=100&status=publish`, {
        headers: getWpHeaders(),
      });

      const coreNav = [
        { id: 'nav-home', label: 'Home', slug: 'home', page: 'home', order: 1 },
        { id: 'nav-shop', label: 'Shop Vault', slug: 'shop', page: 'shop', order: 2 },
        { id: 'nav-handmade', label: 'Handmade Bouquets', slug: 'handmade', page: 'handmade', order: 3 },
        { id: 'nav-bts', label: 'BTS Borahae', slug: 'bts', page: 'bts', order: 4 },
        { id: 'nav-couples', label: 'Couples & Milestones', slug: 'couples', page: 'couples', order: 5 },
      ];

      // Slugs that must never appear in primary top header navigation
      const excludedNavSlugs = new Set([
        'home',
        'shop',
        'handmade',
        'bts',
        'couples',
        'cart',
        'checkout',
        'my-account',
        'account',
        'login',
        'signup',
        'order-confirmation',
        'wishlist',
        'search',
        // Informational, legal & policy pages (retained in footer and direct routes)
        'about',
        'contact',
        'about-us',
        'contact-us',
        'concierge',
        'terms-conditions',
        'terms-and-conditions',
        'terms',
        'privacy-policy',
        'privacy',
        'returns-replacement-guarantee',
        'returns-and-replacement-guarantee',
        'returns-and-replacements',
        'returns-policy',
        'returns',
        'refund-policy',
        'refund',
        'shipping-policy',
        'shipping',
        'cookie-policy',
        'disclaimer',
        'sample-page',
        'faq',
      ]);

      const isPolicyOrExcluded = (slug: string, label?: string) => {
        const s = String(slug || '').toLowerCase();
        const l = String(label || '').toLowerCase();
        if (excludedNavSlugs.has(s)) return true;
        if (
          s.includes('policy') ||
          s.includes('terms') ||
          s.includes('return') ||
          s.includes('refund') ||
          s.includes('shipping') ||
          s.includes('guarantee') ||
          s.includes('privacy') ||
          s.includes('cookie') ||
          s.includes('disclaimer') ||
          s.includes('about') ||
          s.includes('contact') ||
          s.includes('concierge') ||
          s.includes('atelier') ||
          l.includes('contact') ||
          l.includes('about') ||
          l.includes('concierge') ||
          l.includes('atelier')
        ) {
          return true;
        }
        return false;
      };

      if (response.ok) {
        const wpPages = await response.json();
        if (Array.isArray(wpPages) && wpPages.length > 0) {
          const customNavItems = wpPages
            .filter((p: any) => !isPolicyOrExcluded(p.slug, p.title?.rendered))
            .map((p: any, index: number) => ({
              id: `wp-nav-${p.id}`,
              label: stripHtml(p.title?.rendered || p.slug),
              slug: p.slug,
              page: p.slug,
              order: 10 + index,
              isCustom: true,
            }));

          return res.json({
            success: true,
            navigation: [...coreNav, ...customNavItems],
          });
        }
      }

      res.json({
        success: true,
        navigation: coreNav,
      });
    } catch {
      res.json({
        success: true,
        navigation: [
          { id: 'nav-home', label: 'Home', slug: 'home', page: 'home', order: 1 },
          { id: 'nav-shop', label: 'Shop Vault', slug: 'shop', page: 'shop', order: 2 },
          { id: 'nav-handmade', label: 'Handmade Bouquets', slug: 'handmade', page: 'handmade', order: 3 },
          { id: 'nav-bts', label: 'BTS Borahae', slug: 'bts', page: 'bts', order: 4 },
          { id: 'nav-couples', label: 'Couples & Milestones', slug: 'couples', page: 'couples', order: 5 },
        ],
      });
    }
  });

  // POST /api/wp/credentials - SECURED: Update WordPress credentials strictly requiring admin auth
  app.post('/api/wp/credentials', requireAdminAuth, (req, res) => {
    const { username, appPassword } = req.body;
    if (username) wpConfig.username = String(username).trim();
    if (appPassword !== undefined) wpConfig.appPassword = String(appPassword).trim();

    res.json({
      success: true,
      message: 'WordPress credentials updated and active in runtime!',
      status: {
        connected: true,
        storeUrl: wpConfig.url,
        username: wpConfig.username,
        hasAppPassword: Boolean(wpConfig.appPassword),
        woocommerceConfigured: Boolean(wpConfig.consumerKey && wpConfig.consumerSecret),
        syncMode: wpConfig.appPassword ? 'live-wordpress-rest' : 'cached-fallback',
      },
    });
  });

  // -------------------------------------------------------------
  // SECURE PRODUCT RETRIEVAL ENDPOINTS (/api/products/*)
  // -------------------------------------------------------------

  // GET /api/products - Secure proxy route to WooCommerce (with optional category filter)
  app.get('/api/products', async (req, res) => {
    try {
      const categoryParam = (req.query.category as string) || undefined;
      const rawProducts = await fetchWooCommerceFromBackend(categoryParam);
      const formattedProducts = rawProducts.map(formatWcProduct);

      res.json({
        success: true,
        source: 'woocommerce-secure-backend',
        count: formattedProducts.length,
        category: categoryParam || 'all',
        products: formattedProducts,
      });
    } catch (err: any) {
      console.warn('[WooCommerce Proxy Warning]:', err.message);
      res.status(502).json({
        success: false,
        error: 'Failed to retrieve products from WooCommerce store',
        message: err.message,
      });
    }
  });

  // GET /api/categories - Secure dynamic proxy route to WooCommerce product categories
  app.get('/api/categories', async (req, res) => {
    try {
      if (WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
        try {
          const rawCategories = await fetchWooCommerceCategories();
          const validCategories = rawCategories
            .filter((c: any) => c.slug !== 'uncategorized' && c.name?.toLowerCase() !== 'uncategorized')
            .map((c: any) => ({
              id: c.id,
              name: stripHtml(c.name || ''),
              slug: c.slug,
              count: c.count || 0,
              description: stripHtml(c.description || ''),
              image: c.image ? c.image.src : null,
            }));

          if (validCategories.length > 0) {
            return res.json({
              success: true,
              source: 'woocommerce-live',
              count: validCategories.length,
              categories: validCategories,
            });
          }
        } catch (wcErr: any) {
          console.warn('[WooCommerce Categories Proxy Warning]:', wcErr.message);
        }
      }

      // Fallback: Dynamically extract categories from current product catalog
      const rawProducts = await fetchWooCommerceFromBackend().catch(() => []);
      const categoryMap = new Map<string, { id: string | number; name: string; slug: string; count: number }>();

      const prodsToExtract = rawProducts.length > 0 ? rawProducts.map(formatWcProduct) : PRODUCTS;
      prodsToExtract.forEach((p) => {
        const catSlug = p.category || 'all';
        const catName = p.categoryLabel || catSlug;
        if (catSlug && catSlug !== 'all') {
          if (!categoryMap.has(catSlug)) {
            categoryMap.set(catSlug, {
              id: catSlug,
              name: catName,
              slug: catSlug,
              count: 1,
            });
          } else {
            categoryMap.get(catSlug)!.count++;
          }
        }
      });

      const fallbackCategories = Array.from(categoryMap.values());
      res.json({
        success: true,
        source: 'catalog-extracted',
        count: fallbackCategories.length,
        categories: fallbackCategories,
      });
    } catch (err: any) {
      console.warn('[Categories Route Error]:', err.message);
      res.status(502).json({
        success: false,
        error: 'Failed to retrieve categories',
        message: err.message,
      });
    }
  });

  // GET /api/products/:identifier - Secure route for specific product details
  app.get('/api/products/:identifier', async (req, res) => {
    try {
      const { identifier } = req.params;
      const rawProduct = await fetchSingleWooCommerceProduct(identifier);

      if (rawProduct) {
        const formatted = formatWcProduct(rawProduct);
        return res.json({
          success: true,
          source: 'woocommerce-secure-backend',
          product: formatted,
        });
      }

      return res.status(404).json({
        success: false,
        error: `Product not found for "${identifier}"`,
      });
    } catch (err: any) {
      console.error('[WooCommerce Single Product Error]:', err.message);
      res.status(502).json({
        success: false,
        error: 'Failed to retrieve product details from WooCommerce store',
        message: err.message,
      });
    }
  });

  // -------------------------------------------------------------
  // SECURED ADMIN MIGRATION & STATUS ENDPOINTS (/api/admin/*)
  // -------------------------------------------------------------
  app.get('/api/admin/wc-status', requireAdminAuth, async (req, res) => {
    try {
      const cleanUrl = WOOCOMMERCE_URL;
      const authHeader =
        'Basic ' +
        Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');

      const response = await fetch(`${cleanUrl}/wp-json/wc/v3/products?per_page=100`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
          'User-Agent': 'Wishmint-Admin-Status/1.0',
        },
      });

      if (!response.ok) {
        return res.json({
          connected: false,
          storeUrl: cleanUrl,
          productCount: 0,
          error: `WooCommerce returned HTTP ${response.status}`,
        });
      }

      const products = await response.json();
      res.json({
        connected: true,
        storeUrl: cleanUrl,
        productCount: Array.isArray(products) ? products.length : 0,
        products: Array.isArray(products)
          ? products.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              status: p.status,
              imagesCount: p.images?.length || 0,
            }))
          : [],
      });
    } catch (err: any) {
      res.json({
        connected: false,
        storeUrl: WOOCOMMERCE_URL,
        productCount: 0,
        error: err.message,
      });
    }
  });

  app.post('/api/admin/export-products-to-wc', requireAdminAuth, async (req, res) => {
    try {
      console.log('[Admin Migration] Starting WooCommerce product export...');
      const results = await executeWcProductMigration(
        WOOCOMMERCE_URL,
        WOOCOMMERCE_CONSUMER_KEY,
        WOOCOMMERCE_CONSUMER_SECRET
      );
      const successCount = results.filter((r) => r.success).length;

      res.json({
        success: successCount > 0,
        message: `Successfully synchronized ${successCount} products directly into your WooCommerce database!`,
        count: successCount,
        details: results,
      });
    } catch (err: any) {
      console.error('[Admin Migration Error]:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to complete WooCommerce product export',
        message: err.message,
      });
    }
  });

  // Dedicated Hostinger Static ZIP download endpoint
  app.get('/download-hostinger-build', (req, res) => {
    const zipPath = path.resolve(__dirname, 'WISHMINT-HOSTINGER-BUILD.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'WISHMINT-HOSTINGER-BUILD.zip');
    } else {
      res.status(404).send('ZIP file not found. Please trigger a build first.');
    }
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER OR STATIC PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WISHMINT Secure Server] running on http://0.0.0.0:${PORT}`);
    console.log(`[WooCommerce Proxy] pointing securely to ${WOOCOMMERCE_URL}`);
  });
}

startServer();
