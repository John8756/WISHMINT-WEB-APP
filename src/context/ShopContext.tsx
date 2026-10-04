import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Page } from '../types';
import { PRODUCTS } from '../data/products';
import { getProductsFromApi } from '../services/productService';
import { WcCategory, getCategoriesFromApi } from '../services/categoryService';

interface ShopContextType {
  currentPage: Page;
  currentProductSlug: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateTo: (page: Page, productSlug?: string, direction?: 'forward' | 'back') => void;
  navigateBack: () => void;
  transitionState: 'idle' | 'exiting' | 'entering';
  transitionDirection: 'forward' | 'back';
  isTransitioning: boolean;

  // Products Catalog (Live WooCommerce from /api/products)
  products: Product[];
  productsLoading: boolean;
  isLiveWooCommerce: boolean;
  refreshProducts: () => Promise<void>;

  // Dynamic Categories Catalog (Live WooCommerce from /api/categories)
  categories: WcCategory[];
  categoriesLoading: boolean;
  refreshCategories: () => Promise<void>;
  selectedCategory: string | null;
  setSelectedCategory: (categorySlug: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    options?: Record<string, string>,
    personalization?: CartItem['personalization']
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Real Authentication
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // Real Orders (WooCommerce Backend)
  orders: Order[];
  latestOrder: Order | null;
  placeOrder: (details: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
  }) => Promise<Order>;

  // Quick View, Search & Toast
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Helper to safely read from localStorage
function getStoredJson<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) {
      return JSON.parse(val);
    }
  } catch {
    // Ignore JSON parse errors
  }
  return fallback;
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentProductSlug, setCurrentProductSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. PERSISTENT CART: Empty for new users, restored from localStorage on refresh
  const [cart, setCart] = useState<CartItem[]>(() => getStoredJson<CartItem[]>('wishmint_cart', []));

  useEffect(() => {
    try {
      localStorage.setItem('wishmint_cart', JSON.stringify(cart));
    } catch {
      // Storage quota or private mode
    }
  }, [cart]);

  // 2. PERSISTENT WISHLIST: Empty for new users, restored from localStorage on refresh
  const [wishlist, setWishlist] = useState<string[]>(() =>
    getStoredJson<string[]>('wishmint_wishlist', [])
  );

  useEffect(() => {
    try {
      localStorage.setItem('wishmint_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // 3. PERSISTENT ORDERS
  const [orders, setOrders] = useState<Order[]>(() => getStoredJson<Order[]>('wishmint_orders', []));
  const [latestOrder, setLatestOrder] = useState<Order | null>(() =>
    getStoredJson<Order | null>('wishmint_latest_order', null)
  );

  useEffect(() => {
    try {
      localStorage.setItem('wishmint_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    if (latestOrder) {
      try {
        localStorage.setItem('wishmint_latest_order', JSON.stringify(latestOrder));
      } catch {}
    }
  }, [latestOrder]);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // 4. REAL SERVER-AUTHENTICATED USER: Null for new visitors, validated on mount
  const [user, setUser] = useState<User | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Page Transitions
  const [pageHistory, setPageHistory] = useState<{ page: Page; slug?: string }[]>([
    { page: 'home' },
  ]);
  const [transitionState, setTransitionState] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward');

  // Products state (from secure /api/products endpoint)
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [isLiveWooCommerce, setIsLiveWooCommerce] = useState<boolean>(false);

  // Dynamic WooCommerce Categories state
  const [categories, setCategories] = useState<WcCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);

  const refreshCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await getCategoriesFromApi();
      if (res.success && Array.isArray(res.categories) && res.categories.length > 0) {
        setCategories(res.categories);
      } else {
        // Fallback: extract unique categories from products
        const uniqueCatNames = Array.from(
          new Set(products.map((p) => p.categoryLabel || p.category).filter(Boolean))
        );
        const derived: WcCategory[] = uniqueCatNames.map((catName) => {
          const matching = products.find((p) => (p.categoryLabel || p.category) === catName);
          const slug = matching?.category || catName.toLowerCase().replace(/\s+/g, '-');
          return {
            id: slug,
            name: catName,
            slug,
            count: products.filter((p) => (p.categoryLabel || p.category) === catName).length,
          };
        });
        setCategories(derived);
      }
    } catch (err) {
      console.warn('[ShopContext] Error refreshing categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProductsForCategory = async (catIdentifier?: string | null) => {
    setProductsLoading(true);
    try {
      const { products: fetched, isLiveWooCommerce: isLive } = await getProductsFromApi(
        catIdentifier || undefined
      );
      if (fetched) {
        setProducts(fetched);
        if (!catIdentifier || catIdentifier === 'all') {
          setAllProducts(fetched);
        }
        setIsLiveWooCommerce(isLive);
      }
    } catch (err) {
      console.warn('[ShopContext] Error fetching products for category:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const setSelectedCategory = (categorySlug: string | null) => {
    setSelectedCategoryState(categorySlug);
    fetchProductsForCategory(categorySlug);
  };

  const refreshProducts = async () => {
    await fetchProductsForCategory(selectedCategory);
  };

  // Initial load: Fetch products, categories, and verify persistent auth token with backend
  useEffect(() => {
    fetchProductsForCategory(null);
    refreshCategories();

    const storedToken = localStorage.getItem('wishmint_auth_token');
    if (storedToken) {
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Session expired');
        })
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            if (Array.isArray(data.user.orders) && data.user.orders.length > 0) {
              setOrders(data.user.orders);
            }
          }
        })
        .catch(() => {
          // Token is invalid or expired
          localStorage.removeItem('wishmint_auth_token');
          setUser(null);
        });
    }
  }, []);

  // Toast notifications
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Navigation with forward/back history
  const navigateTo = (page: Page, productSlug?: string, direction: 'forward' | 'back' = 'forward') => {
    if (page === currentPage && productSlug === currentProductSlug) return;

    setTransitionDirection(direction);
    setTransitionState('exiting');

    setTimeout(() => {
      setCurrentPage(page);
      if (productSlug !== undefined) {
        setCurrentProductSlug(productSlug || null);
      }
      if (direction === 'forward') {
        setPageHistory((prev) => [...prev, { page, slug: productSlug }]);
      }
      setTransitionState('entering');
      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => {
        setTransitionState('idle');
      }, 250);
    }, 150);
  };

  const navigateBack = () => {
    if (pageHistory.length > 1) {
      const nextHistory = [...pageHistory];
      nextHistory.pop();
      const prevEntry = nextHistory[nextHistory.length - 1];
      setPageHistory(nextHistory);
      navigateTo(prevEntry.page, prevEntry.slug, 'back');
    } else {
      navigateTo('home', undefined, 'back');
    }
  };

  // Cart Management
  const addToCart = (
    product: Product,
    quantity: number = 1,
    options?: Record<string, string>,
    personalization?: CartItem['personalization']
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.selectedOptions || {}) === JSON.stringify(options || {}) &&
          JSON.stringify(item.personalization || {}) === JSON.stringify(personalization || {})
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          productId: product.id,
          product,
          quantity,
          selectedOptions: options,
          personalization,
          price: product.price,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" to your gifting bag. ✨`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from your cart.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('wishmint_cart');
    } catch {}
  };

  // Coupon handling
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WISH10') {
      setAppliedCoupon('WISH10');
      showToast('Offer applied: 10% handcrafted discount unlocked!');
      return { success: true, message: '10% discount applied to your order!' };
    }
    if (clean === 'BORAHAE') {
      setAppliedCoupon('BORAHAE');
      showToast('Borahae blessing: ₹1,200 privilege voucher applied! 💜');
      return { success: true, message: '₹1,200 off your keepsake order!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      showToast('Complimentary protective courier delivery activated! 🚚');
      return { success: true, message: 'Free insured shipping applied!' };
    }
    return { success: false, message: 'Invalid or expired offer code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promotion code removed.');
  };

  // Pricing calculations (Server also enforces these authoritatively upon order placement)
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon === 'WISH10') {
    discount = Math.round(subtotal * 0.1 * 100) / 100;
  } else if (appliedCoupon === 'BORAHAE') {
    discount = Math.min(15.0, subtotal);
  }

  const shipping =
    appliedCoupon === 'FREESHIP' || subtotal >= 75 || subtotal === 0 ? 0.0 : 8.5;
  const total = Math.max(0, subtotal - discount + shipping);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      if (exists) {
        showToast(`Removed "${product?.name || 'Item'}" from your wishlist.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${product?.name || 'Item'}" to your wishlist! 💖`);
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // REAL AUTHENTICATION: Server-side password validation & registration
  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('wishmint_auth_token', data.token);
        setUser(data.user);
        if (Array.isArray(data.user.orders)) {
          setOrders(data.user.orders);
        }
        showToast(`Welcome back, ${data.user.name}! ✨`);
        return true;
      } else {
        showToast(data.error || 'Invalid email or password');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Network error during login');
      return false;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('wishmint_auth_token', data.token);
        setUser(data.user);
        setOrders([]);
        showToast(`Welcome to Wishmint, ${data.user.name}! Your artisanal journey begins. 🎁`);
        return true;
      } else {
        showToast(data.error || 'Failed to create account');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Network error during registration');
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('wishmint_auth_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('wishmint_auth_token');
    setUser(null);
    showToast('You have been safely signed out.');
    navigateTo('home');
  };

  // REAL ORDER PLACEMENT: Dispatched directly to server-side WooCommerce order engine
  const placeOrder = async (details: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
  }): Promise<Order> => {
    const token = localStorage.getItem('wishmint_auth_token');
    const orderPayload = {
      items: cart.map((c) => ({
        productId: c.productId,
        productName: c.product.name,
        productSlug: c.product.slug,
        quantity: c.quantity,
        selectedOptions: c.selectedOptions,
        personalization: c.personalization,
      })),
      shippingAddress: {
        fullName: details.fullName,
        street: details.street,
        city: details.city,
        state: details.state,
        postalCode: details.postalCode,
        country: details.country || 'India',
        email: user?.email,
      },
      paymentMethod: details.paymentMethod,
      couponCode: appliedCoupon,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server order error (${res.status})`);
    }

    const data = await res.json();
    const verifiedOrder: Order = data.order;

    setOrders((prev) => [verifiedOrder, ...prev]);
    setLatestOrder(verifiedOrder);
    clearCart();
    setAppliedCoupon(null);
    navigateTo('order-confirmation');

    if (data.isRealWooCommerce) {
      showToast(`Bespoke Order #${verifiedOrder.id} registered in WooCommerce! 🎉`);
    } else {
      showToast(`Bespoke Order #${verifiedOrder.id} placed successfully! 🎉`);
    }

    return verifiedOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        currentProductSlug,
        searchQuery,
        setSearchQuery,
        navigateTo,
        navigateBack,
        transitionState,
        transitionDirection,
        isTransitioning: transitionState !== 'idle',
        products,
        productsLoading,
        isLiveWooCommerce,
        refreshProducts,
        categories,
        categoriesLoading,
        refreshCategories,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shipping,
        total,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        login,
        signup,
        logout,
        orders,
        latestOrder,
        placeOrder,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
