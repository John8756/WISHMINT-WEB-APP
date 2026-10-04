import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface SwipeCarouselProps {
  children: ReactNode;
  className?: string;
  autoSwipeInterval?: number; // In ms, default 2000 (2s continuous)
  scrollStep?: number; // Optional step in px, or auto-detect card width
  showIndicators?: boolean;
}

export const SwipeCarousel: React.FC<SwipeCarouselProps> = ({
  children,
  className = '',
  autoSwipeInterval = 2000,
  scrollStep,
  showIndicators = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Measure number of direct slide children
  useEffect(() => {
    if (containerRef.current) {
      setSlideCount(containerRef.current.children.length);
    }
  }, [children]);

  // Track active slide based on scroll position
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    const cardWidth = containerRef.current.firstElementChild?.clientWidth || clientWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(newIndex, Math.max(0, slideCount - 1)));
  };

  // Subtle automatic swiping with touch pause
  useEffect(() => {
    if (isInteracting || slideCount <= 1) return;

    const interval = setInterval(() => {
      const el = containerRef.current;
      if (!el) return;

      const firstChild = el.firstElementChild as HTMLElement | null;
      const step = scrollStep || (firstChild ? firstChild.offsetWidth + 16 : 280);
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 15) {
        // Smooth loop back to beginning
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Advance to next card
        el.scrollTo({ left: el.scrollLeft + step, behavior: 'smooth' });
      }
    }, autoSwipeInterval);

    return () => clearInterval(interval);
  }, [isInteracting, slideCount, autoSwipeInterval, scrollStep]);

  // Interaction handlers to pause on touch/pointer
  const handleTouchStart = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsInteracting(true);
  };

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    // Pause for 2.8 seconds after user finishes swipe before resuming auto-swipe
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2800);
  };

  const scrollToSlide = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    const step = scrollStep || (firstChild ? firstChild.offsetWidth + 16 : 280);
    el.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      {/* Scrollable Container with native touch momentum */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handleTouchStart}
        onPointerUp={handleTouchEnd}
        onMouseEnter={handleTouchStart}
        onMouseLeave={handleTouchEnd}
        className={`flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1 -mx-gutter px-gutter touch-pan-x ${className}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      {/* Subtle modern swipe indicator dots */}
      {showIndicators && slideCount > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5 pb-1">
          {Array.from({ length: slideCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx
                  ? 'w-5 bg-[#4A234A] dark:bg-[#ffd9e2]'
                  : 'w-1.5 bg-outline-variant/60 hover:bg-outline'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
