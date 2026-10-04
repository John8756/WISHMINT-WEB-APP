import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { WordPressProvider } from './context/WordPressContext';
import { DynamicWpPage } from './pages/DynamicWpPage';
import { WordPressSyncModal } from './components/common/WordPressSyncModal';

// Desktop Components & Pages (Preserved Exactly as Master)
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { QuickViewModal } from './components/common/QuickViewModal';
import { PageTransition } from './components/common/PageTransition';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { HandmadePage } from './pages/HandmadePage';
import { BtsPage } from './pages/BtsPage';
import { CouplesPage } from './pages/CouplesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AuthPages } from './pages/AuthPages';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import {
  ShippingPolicyPage,
  ReturnsPolicyPage,
  PrivacyPolicyPage,
  TermsPage,
  RefundPolicyPage,
} from './pages/LegalPages';

// Mobile Components & Pages (Dedicated Mobile Architecture)
import { MobileTopBar } from './components/mobile/MobileTopBar';
import { MobileBottomBar } from './components/mobile/MobileBottomBar';
import { MobileNavDrawer } from './components/mobile/MobileNavDrawer';
import { MobileSearchModal } from './components/mobile/MobileSearchModal';
import { MobileHomePage } from './pages/mobile/MobileHomePage';
import { MobileShopPage } from './pages/mobile/MobileShopPage';
import { MobileHandmadePage } from './pages/mobile/MobileHandmadePage';
import { MobileBtsPage } from './pages/mobile/MobileBtsPage';
import { MobileCouplesPage } from './pages/mobile/MobileCouplesPage';
import { MobileProductDetailPage } from './pages/mobile/MobileProductDetailPage';
import { MobileCartPage } from './pages/mobile/MobileCartPage';
import { MobileCheckoutPage } from './pages/mobile/MobileCheckoutPage';
import { MobileOrderConfirmationPage } from './pages/mobile/MobileOrderConfirmationPage';
import { MobileAccountPage } from './pages/mobile/MobileAccountPage';
import { MobileWishlistPage } from './pages/mobile/MobileWishlistPage';
import { MobileSearchPage } from './pages/mobile/MobileSearchPage';
import { MobileAuthPages } from './pages/mobile/MobileAuthPages';
import {
  MobileAboutPage,
  MobileContactPage,
  MobileFaqPage,
  MobileLegalPage,
} from './pages/mobile/MobileInfoPages';

const MainRouter: React.FC = () => {
  const { currentPage } = useShop();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // 1. Desktop Route Renderer (100% Unchanged Desktop Experience)
  const renderDesktopPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'handmade':
        return <HandmadePage />;
      case 'bts':
        return <BtsPage />;
      case 'couples':
        return <CouplesPage />;
      case 'product-details':
        return <ProductDetailPage />;
      case 'search':
        return <SearchResultsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'login':
        return <AuthPages initialMode="login" />;
      case 'signup':
        return <AuthPages initialMode="signup" />;
      case 'forgot-password':
        return <AuthPages initialMode="forgot-password" />;
      case 'account':
        return <AccountPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'shipping':
        return <ShippingPolicyPage />;
      case 'returns':
        return <ReturnsPolicyPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'refund':
        return <RefundPolicyPage />;
      default:
        return <DynamicWpPage slug={currentPage} />;
    }
  };

  // 2. Mobile Route Renderer (Dedicated Mobile Experience)
  const renderMobilePage = () => {
    switch (currentPage) {
      case 'home':
        return <MobileHomePage />;
      case 'shop':
        return <MobileShopPage />;
      case 'handmade':
        return <MobileHandmadePage />;
      case 'bts':
        return <MobileBtsPage />;
      case 'couples':
        return <MobileCouplesPage />;
      case 'product-details':
        return <MobileProductDetailPage />;
      case 'search':
        return <MobileSearchPage />;
      case 'cart':
        return <MobileCartPage />;
      case 'checkout':
        return <MobileCheckoutPage />;
      case 'order-confirmation':
        return <MobileOrderConfirmationPage />;
      case 'login':
        return <MobileAuthPages initialMode="login" />;
      case 'signup':
        return <MobileAuthPages initialMode="signup" />;
      case 'forgot-password':
        return <MobileAuthPages initialMode="forgot-password" />;
      case 'account':
        return <MobileAccountPage />;
      case 'wishlist':
        return <MobileWishlistPage />;
      case 'about':
        return <MobileAboutPage />;
      case 'contact':
        return <MobileContactPage />;
      case 'faq':
        return <MobileFaqPage />;
      case 'shipping':
        return (
          <MobileLegalPage
            title="Shipping & Delivery"
            desc="2–3 days bespoke handcrafting • Carbon neutral tracked delivery"
            content={[
              'Standard Domestic Tracked (3–5 business days): ₹700 (Complimentary on orders ₹6,000+).',
              'Priority Rush Crafting & Express Air (1–2 business days): ₹1,150.',
              'Dispatched in silk-padded rigid presentation boxes. Invoices are never included inside recipient packages.',
            ]}
          />
        );
      case 'returns':
        return (
          <MobileLegalPage
            title="Returns & Exchange"
            desc="100% Transit Safe Arrival Guarantee"
            content={[
              'If any acrylic glass, cloche dome, or shadowbox suffers transit courier damage, send us a photo within 48h for an immediate free remake.',
              'Personalized items with custom names/dates cannot be returned. Non-customized items can be returned within 14 days.',
            ]}
          />
        );
      case 'privacy':
        return (
          <MobileLegalPage
            title="Privacy Policy"
            desc="Your personal milestones are kept strictly confidential."
            content={[
              'We only collect recipient names and messages to prepare and fulfill your gift pieces.',
              'All payment transactions are encrypted via PCI-DSS Level 1 compliant gateways (Apple Pay, UPI, Stripe).',
            ]}
          />
        );
      case 'terms':
        return (
          <MobileLegalPage
            title="Terms & Conditions"
            desc="Atelier Terms of Service"
            content={[
              'Customers are responsible for verifying spellings and dates before placing orders.',
              'All ribbon arrangements, soundwave layouts, and handmade crochet designs are original artistic creations of WISHMINT Studio.',
            ]}
          />
        );
      case 'refund':
        return (
          <MobileLegalPage
            title="Refund Policy"
            desc="Artisanal Client Satisfaction Pledge"
            content={[
              'If an error is made by our atelier (such as an incorrect monogram), a full immediate remake or refund is guaranteed.',
              'Approved refunds are credited to your original payment source within 3–5 business days.',
            ]}
          />
        );
      default:
        return <DynamicWpPage slug={currentPage} />;
    }
  };

  return (
    <>
      {/* ====================================================
          DESKTOP & TABLET VIEWPORT (>= 768px)
          Completely untouched master desktop experience
          ==================================================== */}
      <div className="hidden md:flex min-h-screen flex-col bg-brand-cream text-brand-dark selection:bg-brand-softPink selection:text-brand-plum relative">
        <Header />
        <main className="flex-1 flex flex-col">
          <PageTransition>
            {renderDesktopPage()}
          </PageTransition>
        </main>
        <Footer />
        <QuickViewModal />
        <Toast />
      </div>

      {/* ====================================================
          MOBILE VIEWPORT (<= 767px)
          Dedicated mobile experience matching uploaded HTML
          ==================================================== */}
      <div className="block md:hidden min-h-screen bg-background text-on-surface relative font-body-md text-body-md overflow-x-hidden selection:bg-secondary-container selection:text-primary">
        <MobileTopBar onOpenMenu={() => setMobileDrawerOpen(true)} />
        <main className="min-h-screen flex flex-col mobile-main-content">
          <PageTransition>
            {renderMobilePage()}
          </PageTransition>
        </main>
        <MobileBottomBar />
        <MobileNavDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />
        <MobileSearchModal />
        <Toast />
      </div>

      {/* WordPress Modal Controller (kept for admin accessibility) */}
      <WordPressSyncModal />
    </>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <WordPressProvider>
        <MainRouter />
      </WordPressProvider>
    </ShopProvider>
  );
}
