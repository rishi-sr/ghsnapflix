import { useEffect, useRef } from 'react';

/**
 * Universal smooth scroll reveal hook using IntersectionObserver.
 * Dynamically attaches the revealed class when elements enter the scrollport.
 * Includes safety fallbacks to ensure content is never vanished.
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.01,
    rootMargin = '120px 0px 120px 0px',
    revealedClass = 'is-revealed',
    triggerOnce = true,
  } = options;

  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      el.classList.add(revealedClass);
      return;
    }

    const checkAndReveal = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150 && rect.bottom > -150) {
        el.classList.add(revealedClass);
        return true;
      }
      return false;
    };

    if (checkAndReveal()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(revealedClass);
            observer.unobserve(el);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Fallback safety: ensure content is NEVER vanished or permanently hidden
    const safetyTimer = setTimeout(() => {
      checkAndReveal();
    }, 400);

    const handleScroll = () => {
      if (checkAndReveal()) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, rootMargin, revealedClass]);

  return elementRef;
}

export function useScrollRevealContainer(childSelector = '.reveal-item', options = {}) {
  const containerRef = useRef(null);
  const { threshold = 0.01, rootMargin = '100px 0px 100px 0px', revealedClass = 'is-revealed' } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(revealedClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    children.forEach((child) => observer.observe(child));

    // Fallback: reveal any remaining children after a moment
    const fallbackTimer = setTimeout(() => {
      children.forEach((child) => child.classList.add(revealedClass));
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [childSelector, threshold, rootMargin, revealedClass]);

  return containerRef;
}
