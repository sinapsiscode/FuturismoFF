import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Establecer el valor inicial
    setMatches(media.matches);

    // Crear listener para cambios
    const listener = (event) => {
      setMatches(event.matches);
    };

    // Agregar listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};

// Hooks predefinidos para breakpoints comunes
export const useIsMobile = () => useMediaQuery('(max-width: 640px)');
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

export default useMediaQuery;