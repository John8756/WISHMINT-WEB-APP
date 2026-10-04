import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-8 right-6 md:right-10 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
      <div className="liquid-glass-plum text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-brand-rosegold/50 font-sans text-xs font-medium backdrop-blur-xl">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-brand-rosegold flex-none">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="leading-snug">{toastMessage}</span>
      </div>
    </div>
  );
};
