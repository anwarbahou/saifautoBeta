"use client"

import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking whether a media query matches.
 * @param query The media query string (e.g., "(max-width: 768px)").
 * @returns True if the media query matches, false otherwise.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    // Initial check
    documentChangeHandler();

    // Listen for changes
    try {
      mediaQueryList.addEventListener('change', documentChangeHandler);
    } catch (e) {
      // For older browsers
      mediaQueryList.addListener(documentChangeHandler);
    }

    return () => {
      try {
        mediaQueryList.removeEventListener('change', documentChangeHandler);
      } catch (e) {
        // For older browsers
        mediaQueryList.removeListener(documentChangeHandler);
      }
    };
  }, [query]);

  return matches;
}; 