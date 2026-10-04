export type Page =
  | 'home'
  | 'shop'
  | 'handmade'
  | 'bts'
  | 'couples'
  | 'product-details'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'account'
  | 'wishlist'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms'
  | 'refund'
  | (string & {});

export type ProductCategory = 'handmade' | 'bts' | 'couples' | 'custom' | (string & {});

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatar?: string;
  occasion?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  categoryIds?: number[];
  categorySlugs?: string[];
  wcCategories?: { id: number; name: string; slug: string }[];
  price: number;
  originalPrice?: number;
  images: string[];
  shortDescription: string;
  description: string;
  rating: number;
  reviewCount: number;
  options?: ProductOption[];
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  source?: 'woocommerce' | 'local';
  wcId?: number;
  onSale?: boolean;
  priceHtml?: string;
  craftingTime: string;
  customizable: boolean;
  customFields?: {
    recipientName?: boolean;
    anniversaryDate?: boolean;
    spotifySong?: boolean;
    customNote?: boolean;
    foilColor?: boolean;
  };
  details: string[];
  reviews: Review[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  personalization?: {
    recipientName?: string;
    anniversaryDate?: string;
    spotifySong?: string;
    customNote?: string;
    foilColor?: string;
    uploadedPhoto?: string;
    uploadedPhotoName?: string;
    uploadedFile?: string;
    uploadedFileName?: string;
    orderType?: 'custom-photo-frame' | 'wool-art-creation' | string;
    frameFinish?: string;
    woolPalette?: string;
  };
  price: number;
}

export interface Address {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  personalization?: CartItem['personalization'];
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Handcrafting' | 'Shipped' | 'Delivered';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export interface User {
  name: string;
  email: string;
  memberSince: string;
  addresses: Address[];
  orders: Order[];
}
