import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WpPageStructure, DEFAULT_WP_PAGES } from '../data/defaultPages';
import {
  WpNavigationItem,
  WpStatusResponse,
  getWpPages,
  getWpNavigation,
  getWpStatus,
  syncPagesToWordPress,
  createOrUpdateWpPage,
  deleteWpPage,
  updateWpCredentials,
} from '../services/wpService';

interface WordPressContextType {
  pages: WpPageStructure[];
  navItems: WpNavigationItem[];
  isLoading: boolean;
  isSyncing: boolean;
  syncStatus: WpStatusResponse | null;
  lastSyncedAt: string | null;
  syncMessage: string | null;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;
  refreshFromWordPress: () => Promise<void>;
  syncAllToWordPress: () => Promise<{ success: boolean; message: string }>;
  savePageToWordPress: (page: WpPageStructure) => Promise<{ success: boolean; message?: string }>;
  removePageFromWordPress: (id: number | string) => Promise<{ success: boolean; message?: string }>;
  configureCredentials: (username: string, appPassword: string) => Promise<{ success: boolean; message: string }>;
}

const WordPressContext = createContext<WordPressContextType | undefined>(undefined);

export const WordPressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<WpPageStructure[]>(DEFAULT_WP_PAGES);
  const [navItems, setNavItems] = useState<WpNavigationItem[]>([
    { id: 'nav-home', label: 'Home', slug: 'home', page: 'home', order: 1 },
    { id: 'nav-shop', label: 'Shop Vault', slug: 'shop', page: 'shop', order: 2 },
    { id: 'nav-handmade', label: 'Handmade Bouquets', slug: 'handmade', page: 'handmade', order: 3 },
    { id: 'nav-bts', label: 'BTS Borahae', slug: 'bts', page: 'bts', order: 4 },
    { id: 'nav-couples', label: 'Couples & Milestones', slug: 'couples', page: 'couples', order: 5 },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<WpStatusResponse | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  // Load pages, navigation, and connection status from WordPress backend
  const refreshFromWordPress = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pagesRes, navRes, statusRes] = await Promise.all([
        getWpPages(),
        getWpNavigation(),
        getWpStatus(),
      ]);

      if (pagesRes.pages && pagesRes.pages.length > 0) {
        setPages(pagesRes.pages);
      }
      if (navRes.navigation && navRes.navigation.length > 0) {
        setNavItems(navRes.navigation);
      }
      setSyncStatus(statusRes);
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      console.warn('[WordPressContext] Refresh error:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshFromWordPress();
  }, [refreshFromWordPress]);

  // Sync All App Pages directly into WordPress (/wp-json/wp/v2/pages)
  const syncAllToWordPress = async () => {
    setIsSyncing(true);
    setSyncMessage('Syncing page structures to WordPress database...');
    try {
      const result = await syncPagesToWordPress(pages);
      if (result.success) {
        if (result.pages && result.pages.length > 0) {
          setPages(result.pages);
        }
        setSyncMessage(`Successfully synchronized ${result.syncedCount || pages.length} pages to WordPress!`);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        await refreshFromWordPress();
        return { success: true, message: result.message };
      } else {
        setSyncMessage(result.message || 'Sync encountered an issue');
        return { success: false, message: result.message };
      }
    } catch (err: any) {
      setSyncMessage(err.message || 'Failed to sync to WordPress');
      return { success: false, message: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  // Create or Update a page
  const savePageToWordPress = async (page: WpPageStructure) => {
    setIsSyncing(true);
    try {
      const result = await createOrUpdateWpPage(page);
      if (result.success && result.page) {
        setPages((prev) => {
          const index = prev.findIndex((p) => p.slug === page.slug || (p.id && p.id === page.id));
          if (index >= 0) {
            const next = [...prev];
            next[index] = result.page!;
            return next;
          }
          return [...prev, result.page!];
        });
        await refreshFromWordPress();
        return { success: true, message: 'Page successfully saved to WordPress' };
      }
      return { success: false, message: result.error || 'Failed to save page' };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete a page
  const removePageFromWordPress = async (id: number | string) => {
    setIsSyncing(true);
    try {
      const result = await deleteWpPage(id);
      if (result.success) {
        setPages((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
        await refreshFromWordPress();
        return { success: true, message: 'Page deleted from WordPress' };
      }
      return { success: false, message: result.error || 'Failed to delete page' };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  // Configure WordPress credentials at runtime
  const configureCredentials = async (username: string, appPassword: string) => {
    setIsSyncing(true);
    try {
      const res = await updateWpCredentials({ username, appPassword });
      if (res.success && res.status) {
        setSyncStatus(res.status);
      }
      await refreshFromWordPress();
      return res;
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <WordPressContext.Provider
      value={{
        pages,
        navItems,
        isLoading,
        isSyncing,
        syncStatus,
        lastSyncedAt,
        syncMessage,
        isSyncModalOpen,
        setIsSyncModalOpen,
        refreshFromWordPress,
        syncAllToWordPress,
        savePageToWordPress,
        removePageFromWordPress,
        configureCredentials,
      }}
    >
      {children}
    </WordPressContext.Provider>
  );
};

export const useWordPress = () => {
  const context = useContext(WordPressContext);
  if (!context) {
    throw new Error('useWordPress must be used within a WordPressProvider');
  }
  return context;
};
