// Custom hook for accessibility improvements
import { useEffect, useState } from 'react';

export const useKeyboardNavigation = () => {
  const [focusedElement, setFocusedElement] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip navigation for form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Tab navigation enhancement
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
          // Previous element
          const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : focusableElements.length - 1;
          focusableElements[prevIndex]?.focus();
        } else {
          // Next element
          const nextIndex = focusedIndex < focusableElements.length - 1 ? focusedIndex + 1 : 0;
          focusableElements[nextIndex]?.focus();
        }
        e.preventDefault();
      }

      // Arrow key navigation for grids
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const currentElement = document.activeElement;
        if (currentElement && currentElement.getAttribute('data-grid-item')) {
          handleGridNavigation(e.key, currentElement);
          e.preventDefault();
        }
      }
    };

    const handleGridNavigation = (key, element) => {
      const gridContainer = element.closest('[data-grid]');
      if (!gridContainer) return;

      const items = Array.from(gridContainer.querySelectorAll('[data-grid-item]'));
      const currentIndex = items.indexOf(element);
      const columns = parseInt(gridContainer.dataset.columns) || 1;
      const rows = Math.ceil(items.length / columns);

      let targetIndex;
      switch (key) {
        case 'ArrowRight':
          targetIndex = currentIndex + 1;
          if (targetIndex >= items.length) targetIndex = 0;
          break;
        case 'ArrowLeft':
          targetIndex = currentIndex - 1;
          if (targetIndex < 0) targetIndex = items.length - 1;
          break;
        case 'ArrowDown':
          targetIndex = currentIndex + columns;
          if (targetIndex >= items.length) targetIndex = currentIndex % columns;
          break;
        case 'ArrowUp':
          targetIndex = currentIndex - columns;
          if (targetIndex < 0) {
            const lastRowStart = (rows - 1) * columns;
            targetIndex = lastRowStart + (currentIndex % columns);
            if (targetIndex >= items.length) targetIndex = items.length - 1;
          }
          break;
        default:
          return;
      }

      items[targetIndex]?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { focusedElement, setFocusedElement };
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
};

export const useFocusManagement = () => {
  const trapFocus = (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleTabKey);
  };

  return { trapFocus };
};
