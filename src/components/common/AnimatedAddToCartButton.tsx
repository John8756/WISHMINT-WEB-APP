import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

export interface AnimatedAddToCartButtonProps {
  onAdd: () => void | Promise<void>;
  label?: React.ReactNode;
  activeLabel?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  variant?: 'pill' | 'compact' | 'icon' | 'full';
  theme?: 'dark' | 'plum' | 'purple' | 'auto';
  showPrice?: string;
  ariaLabel?: string;
}

export const AnimatedAddToCartButton: React.FC<AnimatedAddToCartButtonProps> = ({
  onAdd,
  label = 'ADD TO CART',
  activeLabel = 'ADDED!',
  disabled = false,
  className = '',
  style,
  title,
  variant = 'pill',
  theme = 'plum',
  showPrice,
  ariaLabel,
}) => {
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled || state !== 'idle') return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setState('added');
      onAdd();
      timerRef.current = setTimeout(() => {
        setState('idle');
      }, 900);
      return;
    }

    // Set state to adding
    setState('adding');

    // Trigger the actual ecommerce cart update when the cart departs with the item (frame 50/60 ~ 750ms)
    timerRef.current = setTimeout(() => {
      onAdd();
      setState('added');

      // Return smoothly to idle after confirmation
      timerRef.current = setTimeout(() => {
        setState('idle');
      }, 700);
    }, 850);
  };

  // Determine base color styles
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-[#181116] hover:bg-[#281b25] text-white shadow-md hover:shadow-lg';
      case 'purple':
        return 'bg-purple-700 hover:bg-purple-600 text-white shadow-md hover:shadow-lg';
      case 'plum':
      default:
        return 'bg-[#4A234A] hover:bg-[#341534] text-white shadow-md hover:shadow-xl';
    }
  };

  // Icon only mode (e.g. small circle buttons)
  if (variant === 'icon') {
    return (
      <button
        type="button"
        data-state={state}
        disabled={disabled}
        onClick={handleClick}
        title={title || (typeof label === 'string' ? label : 'Add to Cart')}
        aria-label={ariaLabel || (typeof label === 'string' ? label : 'Add to Cart')}
        className={`btn-add-to-cart ${getThemeClasses()} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        style={style}
      >
        <span className="cart-anim-track">
          {/* Falling Gift Package */}
          <span className="item-drop-anim">
            <svg viewBox="0 0 16 16" fill="none" className="w-full h-full text-brand-blush">
              <rect x="2" y="5" width="12" height="9" rx="1.5" fill="currentColor" />
              <path d="M8 5V14M2 9H14" stroke="#4A234A" strokeWidth="1.2" />
              <path d="M5.5 3C5.5 2 6.5 1 8 2.5C9.5 1 10.5 2 10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>

          {/* Shopping Cart Icon from Reference */}
          <svg
            viewBox="0 0 52 44"
            fill="none"
            className="cart-anim-svg text-white"
          >
            <path
              d="M4 6H12L18.5 29H42L47.5 13H14"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="21" cy="37" r="3.2" fill="currentColor" />
            <circle cx="39" cy="37" r="3.2" fill="currentColor" />
          </svg>
        </span>

        {/* Success Checkmark */}
        <span className="cart-success-badge">
          <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
        </span>
      </button>
    );
  }

  // Full & Pill Buttons (Matches Reference Image Exactly)
  return (
    <button
      type="button"
      data-state={state}
      disabled={disabled}
      onClick={handleClick}
      title={title || (typeof label === 'string' ? label : 'Add to Cart')}
      aria-label={ariaLabel || (typeof label === 'string' ? label : 'Add to Cart')}
      className={`btn-add-to-cart relative ${getThemeClasses()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      style={style}
    >
      {/* Default Idle & Animating Content */}
      <div className="btn-content-default flex items-center justify-center gap-2.5 w-full px-4 py-2.5 transition-opacity duration-200">
        {/* Shopping Cart with Animated Item */}
        <span className="cart-anim-track">
          {/* Falling Gift Item */}
          <span className="item-drop-anim">
            <svg viewBox="0 0 16 16" fill="none" className="w-full h-full text-brand-blush">
              <rect x="2" y="5" width="12" height="9" rx="1.5" fill="currentColor" />
              <path d="M8 5V14M2 9H14" stroke="#4A234A" strokeWidth="1.2" />
              <path d="M5.5 3C5.5 2 6.5 1 8 2.5C9.5 1 10.5 2 10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>

          {/* Reference Cart SVG (ViewBox 0 0 52 44) */}
          <svg
            viewBox="0 0 52 44"
            fill="none"
            className="cart-anim-svg text-white"
          >
            <path
              d="M4 6H12L18.5 29H42L47.5 13H14"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="21" cy="37" r="3.2" fill="currentColor" />
            <circle cx="39" cy="37" r="3.2" fill="currentColor" />
          </svg>
        </span>

        {/* Text Label */}
        <span className="btn-label-text font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
          {state === 'adding' ? 'ADDING...' : label}
          {showPrice && <span className="opacity-90 ml-1.5">&bull; {showPrice}</span>}
        </span>
      </div>

      {/* Success Badge */}
      <span className="cart-success-badge font-semibold uppercase tracking-wider text-xs text-white">
        <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
        <span>{activeLabel}</span>
      </span>
    </button>
  );
};
