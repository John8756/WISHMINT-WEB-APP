import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useWordPress } from '../context/WordPressContext';
import { getWpPage } from '../services/wpService';
import { WpPageStructure } from '../data/defaultPages';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  Globe,
  RefreshCw,
  Edit3,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface DynamicWpPageProps {
  slug: string;
}

export const DynamicWpPage: React.FC<DynamicWpPageProps> = ({ slug }) => {
  const { navigateTo } = useShop();
  const { pages, refreshFromWordPress, isSyncing, syncStatus, setIsSyncModalOpen } = useWordPress();

  const [page, setPage] = useState<WpPageStructure | null>(() => {
    return pages.find((p) => p.slug === slug) || null;
  });
  const [loading, setLoading] = useState<boolean>(!page);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const cached = pages.find((p) => p.slug === slug);
    if (cached) {
      setPage(cached);
    } else {
      setLoading(true);
    }

    getWpPage(slug)
      .then((res) => {
        if (!isMounted) return;
        if (res.page) {
          setPage(res.page);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, pages]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshFromWordPress();
    const updated = await getWpPage(slug);
    if (updated.page) {
      setPage(updated.page);
    }
    setIsRefreshing(false);
  };

  const wpAdminUrl = syncStatus?.storeUrl
    ? `${syncStatus.storeUrl}/wp-admin/edit.php?post_type=page`
    : 'https://whitesmoke-wolverine-491981.hostingersite.com/wp-admin/edit.php?post_type=page';

  if (loading && !page) {
    return (
      <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
        <div className="h-6 w-48 bg-brand-plum/10 rounded-full animate-pulse mb-8" />
        <div className="h-10 w-3/4 bg-brand-plum/15 rounded-xl animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-brand-plum/5 rounded-lg animate-pulse" />
          <div className="h-4 w-5/6 bg-brand-plum/5 rounded-lg animate-pulse" />
          <div className="h-4 w-4/6 bg-brand-plum/5 rounded-lg animate-pulse" />
          <div className="h-48 w-full bg-brand-plum/10 rounded-2xl animate-pulse mt-8" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-md mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Globe className="w-12 h-12 text-brand-plum/40 mb-4" />
        <h2 className="font-serif text-2xl text-brand-dark mb-2">Page Not Found</h2>
        <p className="text-xs text-brand-gray mb-6">
          This page hasn't been created in WordPress yet or was recently removed.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Breadcrumb
          items={[
            { label: 'Atelier', page: 'home' },
            { label: 'WordPress Pages', page: 'home' },
            { label: page.title },
          ]}
        />

        {/* Live WordPress Sync Management Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill text-[11px] font-semibold text-brand-plum hover:bg-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Fetch live updates from WordPress admin"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Pulling from WP...' : 'Refresh from WP'}</span>
          </button>

          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-plum text-white text-[11px] font-semibold hover:brightness-110 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-brand-blush" />
            <span>Two-Way Sync Panel</span>
          </button>
        </div>
      </div>

      {/* Featured Header Card */}
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-xl mb-10 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>WordPress Live Synced Page</span>
          </span>

          <span className="text-xs text-brand-gray flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Slug: /{page.slug}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-dark leading-tight mb-4">
          {page.title}
        </h1>

        {page.excerpt && (
          <p className="text-sm sm:text-base text-brand-gray/90 max-w-3xl leading-relaxed font-normal">
            {page.excerpt}
          </p>
        )}

        {/* Featured Image if available */}
        {page.featuredImage && (
          <div className="mt-8 rounded-2xl overflow-hidden aspect-[21/9] w-full max-h-96 shadow-md border border-white/60">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Rich Page Content Body */}
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-md">
        <div
          className="prose prose-brand max-w-none text-brand-dark leading-relaxed text-sm sm:text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Admin Direct Action Callout */}
        <div className="mt-12 pt-6 border-t border-brand-plum/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brand-gray">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Managed directly from your Hostinger WordPress Admin panel (/wp-admin/edit.php?post_type=page)</span>
          </div>

          <a
            href={wpAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass-pill text-brand-plum font-semibold hover:bg-white transition-all w-fit cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit in WP Admin</span>
          </a>
        </div>
      </div>
    </div>
  );
};
