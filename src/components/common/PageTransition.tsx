import React, { ReactNode } from 'react';
import { useShop } from '../../context/ShopContext';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const { transitionState, transitionDirection, isTransitioning } = useShop();

  const getTransitionClass = () => {
    if (transitionState === 'exiting') {
      return transitionDirection === 'back'
        ? 'page-transition-exit-back'
        : 'page-transition-exit-forward';
    }
    if (transitionState === 'entering') {
      return transitionDirection === 'back'
        ? 'page-transition-enter-back'
        : 'page-transition-enter-forward';
    }
    return '';
  };

  return (
    <div className="relative w-full flex-1 flex flex-col">
      {/* Subtle Luxury Ribbon Shimmer Accent at Top of Viewport during transitions */}
      {isTransitioning && (
        <div
          className="fixed top-0 left-0 right-0 h-[2.5px] z-[999] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#C9A46C] to-[#4A234A] animate-luxury-shimmer shadow-[0_0_10px_rgba(201,164,108,0.9)]" />
        </div>
      )}

      {/* GPU-Accelerated Page Content Transition Container */}
      <div
        className={`w-full flex-1 flex flex-col will-change-[transform,opacity,filter] ${getTransitionClass()} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
