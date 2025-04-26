import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Loading component
const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
    <p className="loader-text">Loading content...</p>
  </div>
);

// Lazy load components with prefetching
const lazyWithPrefetch = (factory: () => Promise<any>, displayName: string) => {
  const Component = lazy(factory);
  Component.displayName = `Lazy${displayName}`;
  
  // Prefetch in idle time or after initial page load
  if (typeof window !== 'undefined') {
    const prefetch = () => {
      // Use requestIdleCallback to not block main thread
      const requestIdleCallback = 
        window.requestIdleCallback || 
        ((cb) => setTimeout(cb, 1));
      
      requestIdleCallback(() => {
        // Start loading the component in background
        factory().catch(err => console.warn('Prefetch failed', err));
      });
    };
    
    // Prefetch after page has loaded
    if (document.readyState === 'complete') {
      prefetch();
    } else {
      window.addEventListener('load', prefetch);
    }
  }
  
  return Component;
};

// Lazy-loaded pages with meaningful chunk names
const Home = lazyWithPrefetch(() => import('./pages/Home'), 'Home');
const UFCPage = lazyWithPrefetch(() => import('./pages/UFCPage'), 'UFCPage');
const FootballPage = lazyWithPrefetch(() => import('./pages/FootballPage'), 'FootballPage');
const Formula1Page = lazyWithPrefetch(() => import('./pages/Formula1Page'), 'Formula1Page');
const EsportsPage = lazyWithPrefetch(() => import('./pages/EsportsPage'), 'EsportsPage');
const NotFound = lazyWithPrefetch(() => import('./pages/NotFound'), 'NotFound');

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/ufc" element={<UFCPage />} />
          <Route path="/football" element={<FootballPage />} />
          <Route path="/formula1" element={<Formula1Page />} />
          <Route path="/esports" element={<EsportsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

// Helper to preload routes on hover/focus
export const preloadRoute = (path: string) => {
  switch(path) {
    case '/':
      import('./pages/Home');
      break;
    case '/ufc':
      import('./pages/UFCPage');
      break;
    case '/football':
      import('./pages/FootballPage');
      break;
    case '/formula1':
      import('./pages/Formula1Page');
      break;
    case '/esports':
      import('./pages/EsportsPage');
      break;
    default:
      // No preload for unknown routes
      break;
  }
};

export default AppRoutes;