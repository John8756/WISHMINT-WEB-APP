import React, { useState } from 'react';
import { useWordPress } from '../../context/WordPressContext';
import { useShop } from '../../context/ShopContext';
import { WpPageStructure } from '../../data/defaultPages';
import {
  Globe,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  X,
  ExternalLink,
  Plus,
  Shield,
  Layers,
  ArrowRight,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';

export const WordPressSyncModal: React.FC = () => {
  const {
    pages,
    isSyncModalOpen,
    setIsSyncModalOpen,
    syncStatus,
    isSyncing,
    syncMessage,
    lastSyncedAt,
    syncAllToWordPress,
    refreshFromWordPress,
    savePageToWordPress,
    configureCredentials,
  } = useWordPress();

  const { navigateTo, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<'status' | 'pages' | 'create' | 'settings'>('status');
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState(syncStatus?.username || 'iliasmondal837');
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [credsFeedback, setCredsFeedback] = useState<string | null>(null);

  // New page form state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newInNav, setNewInNav] = useState(true);
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  if (!isSyncModalOpen) return null;

  const handleSyncAll = async () => {
    const res = await syncAllToWordPress();
    showToast(res.message);
  };

  const handleRefresh = async () => {
    await refreshFromWordPress();
    showToast('Fetched live data from WordPress!');
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCreds(true);
    setCredsFeedback(null);
    try {
      const res = await configureCredentials(usernameInput.trim(), appPasswordInput.trim());
      setCredsFeedback(res.message);
      showToast(res.message);
      if (res.success) {
        setAppPasswordInput('');
      }
    } finally {
      setIsSavingCreds(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreatingPage(true);
    const slug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPage: WpPageStructure = {
      title: newTitle.trim(),
      slug,
      content: newContent.trim() || `<p>Welcome to ${newTitle}. This page was created through AI Studio and synchronized to WordPress.</p>`,
      inNavigation: newInNav,
      status: 'publish',
      menuOrder: pages.length + 1,
    };

    const res = await savePageToWordPress(newPage);
    setIsCreatingPage(false);
    showToast(res.message || 'Page created!');
    if (res.success) {
      setNewTitle('');
      setNewSlug('');
      setNewContent('');
      setActiveTab('pages');
    }
  };

  const storeUrl = syncStatus?.storeUrl || 'https://whitesmoke-wolverine-491981.hostingersite.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl liquid-glass-card bg-brand-cream/95 border border-white/90 shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-brand-plum/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-plum text-white">
                <Globe className="w-5 h-5 text-brand-blush" />
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-brand-plum font-normal">
                  WordPress Two-Way Dynamic Sync
                </h3>
                <p className="text-xs text-brand-gray">
                  Hostinger Backend Integration &mdash; <span className="font-mono text-brand-dark">{storeUrl}</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSyncModalOpen(false)}
            className="p-2 rounded-full hover:bg-black/5 text-brand-gray hover:text-brand-dark transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-brand-plum/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-gray hover:text-brand-plum'
            }`}
          >
            Sync Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'pages'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-gray hover:text-brand-plum'
            }`}
          >
            Live Pages ({pages.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-gray hover:text-brand-plum'
            }`}
          >
            + Create Page
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'liquid-glass-plum text-white shadow-sm'
                : 'text-brand-gray hover:text-brand-plum'
            }`}
          >
            WP Credentials
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 custom-scrollbar">
          {/* TAB 1: STATUS & DASHBOARD */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Connection Status Card */}
              <div className="p-5 rounded-2xl bg-white/70 border border-brand-plum/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-none">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-medium text-brand-dark">WordPress REST API Connected</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xs text-brand-gray">
                      Authenticated as <strong>{syncStatus?.username || 'iliasmondal837'}</strong> &bull; Last synced: {lastSyncedAt || 'Active'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass-pill text-xs font-semibold text-brand-plum hover:bg-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Pull from WP</span>
                  </button>

                  <button
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass-plum text-white text-xs font-semibold hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Sync Pages to WP</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {syncMessage && (
                <div className="p-3.5 rounded-xl bg-brand-plum/5 border border-brand-plum/20 text-xs text-brand-plum flex items-center gap-2">
                  <Info className="w-4 h-4 flex-none" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* Architecture Blueprint Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl liquid-glass-pill bg-white/60 border border-white/80 space-y-2">
                  <div className="flex items-center gap-2 text-brand-plum font-semibold text-xs uppercase tracking-wider">
                    <UploadCloud className="w-4 h-4" />
                    <span>1. AI Studio &rarr; WordPress Push</span>
                  </div>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    Whenever you add, modify, or customize page structures in AI Studio, clicking <strong>Sync Pages to WP</strong> writes them directly to your WordPress database via <code>/wp-json/wp/v2/pages</code>. They appear in WP Admin under <strong>Pages</strong>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl liquid-glass-pill bg-white/60 border border-white/80 space-y-2">
                  <div className="flex items-center gap-2 text-brand-plum font-semibold text-xs uppercase tracking-wider">
                    <RefreshCw className="w-4 h-4" />
                    <span>2. WordPress &rarr; AI Studio Pull</span>
                  </div>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    Once synced, if you edit copy, modify layout blocks, or delete pages inside the WordPress admin panel, the frontend fetches that data dynamically, keeping the live site in continuous synchronization.
                  </p>
                </div>
              </div>

              {/* Admin Direct Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`${storeUrl}/wp-admin/edit.php?post_type=page`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-brand-plum/20 text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  <span>Open WP Admin Pages</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-gray" />
                </a>

                <a
                  href={`${storeUrl}/wp-admin/nav-menus.php`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-brand-plum/20 text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  <span>Open WP Menus Manager</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-gray" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE PAGES LIST */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-plum">
                  Configured WordPress Pages
                </span>
                <button
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="text-xs font-semibold text-brand-plum hover:underline cursor-pointer flex items-center gap-1"
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Push All to WordPress</span>
                </button>
              </div>

              <div className="space-y-2">
                {pages.map((p) => (
                  <div
                    key={p.slug}
                    className="p-3.5 rounded-2xl bg-white/70 border border-brand-plum/10 hover:border-brand-plum/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-medium text-brand-dark">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-plum/10 text-brand-plum">
                          /{p.slug}
                        </span>
                        {p.inNavigation && (
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            In Navbar
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-gray line-clamp-1 mt-0.5">
                        {p.excerpt || 'Custom page content configured for atelier.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsSyncModalOpen(false);
                          navigateTo(p.slug as any);
                        }}
                        className="px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-brand-plum hover:bg-white transition-colors cursor-pointer"
                      >
                        View Page
                      </button>

                      <a
                        href={`${storeUrl}/wp-admin/edit.php?post_type=page`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full hover:bg-black/5 text-brand-gray hover:text-brand-plum transition-colors"
                        title="Edit in WP Admin"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE NEW PAGE */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-brand-plum/10 space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-plum block mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (!newSlug) {
                        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Bridal Keepsake Collection"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-plum block mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center rounded-xl bg-white border border-brand-plum/20 px-3">
                    <span className="text-xs text-brand-gray font-mono">/</span>
                    <input
                      type="text"
                      required
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="bridal-keepsake-collection"
                      className="w-full py-2.5 px-1 bg-transparent text-xs text-brand-dark font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-plum block mb-1">
                    Page HTML Content
                  </label>
                  <textarea
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="<h2>Custom Collection</h2><p>Describe your custom atelier offering here...</p>"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum font-mono leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="inNavCheckbox"
                    checked={newInNav}
                    onChange={(e) => setNewInNav(e.target.checked)}
                    className="rounded text-brand-plum focus:ring-brand-plum cursor-pointer"
                  />
                  <label htmlFor="inNavCheckbox" className="text-xs text-brand-dark cursor-pointer font-medium">
                    Include in primary navigation menu immediately
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingPage || !newTitle.trim()}
                className="w-full py-3 rounded-full liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Plus className="w-4 h-4 text-brand-blush" />
                <span>{isCreatingPage ? 'Creating in WordPress...' : 'Create & Sync to WordPress Database'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: CREDENTIALS SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/70 border border-brand-plum/10 space-y-3">
                <div className="flex items-center gap-2 text-brand-plum text-xs font-semibold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>WordPress REST Authentication</span>
                </div>

                <p className="text-xs text-brand-gray leading-relaxed">
                  WordPress Core uses Application Passwords for write access to <code>/wp-json/wp/v2/pages</code>. You can generate one in 1 click inside your WordPress admin area.
                </p>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-plum block mb-1">
                    WordPress Admin Username / Email
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="iliasmondal837"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-plum block mb-1">
                    WordPress Application Password
                  </label>
                  <input
                    type="password"
                    value={appPasswordInput}
                    onChange={(e) => setAppPasswordInput(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-brand-plum/20 text-xs text-brand-dark focus:outline-none focus:border-brand-plum font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-brand-cream border border-brand-plum/10 text-[11px] text-brand-dark space-y-1">
                  <span className="font-bold block">How to get your Application Password:</span>
                  <p className="text-brand-gray">
                    1. Go to <strong>WP Admin &rarr; Users &rarr; Profile</strong>
                  </p>
                  <p className="text-brand-gray">
                    2. Scroll down to <strong>Application Passwords</strong> &rarr; enter "AI Studio" &rarr; click <strong>Add New</strong>.
                  </p>
                  <p className="text-brand-gray">
                    3. Copy the 16-character password and paste it above.
                  </p>
                  <a
                    href={`${storeUrl}/wp-admin/profile.php#application-passwords-section`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-plum font-bold hover:underline pt-1"
                  >
                    <span>Open WP Profile &rarr; Application Passwords</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {credsFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 flex-none" />
                    <span>{credsFeedback}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSavingCreds}
                className="w-full py-3 rounded-full liquid-glass-plum text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Shield className="w-4 h-4 text-brand-blush" />
                <span>{isSavingCreds ? 'Verifying with WordPress...' : 'Save & Test WordPress Credentials'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
