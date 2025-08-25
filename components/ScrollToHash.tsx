import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Listens for URL hash changes (e.g. “/#features”) and, after the
 * route finishes loading, scrolls smoothly to the element whose id
 * matches the hash. Works for links clicked from any page or after a
 * refresh on a hash URL.
 */
const ScrollToHash: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // wait a tick so the DOM is rendered
    setTimeout(() => {
      const el = document.getElementById(hash.substring(1));
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [hash]);

  return null;
};

export default ScrollToHash;
