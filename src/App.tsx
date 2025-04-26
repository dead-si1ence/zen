import { HashRouter } from 'react-router-dom';
import { lazy, Suspense, useState, createContext, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import AppRoutes from './routes';

// Import fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto-slab/400.css';
import '@fontsource/roboto-slab/600.css';
import '@fontsource/roboto-slab/700.css';

// CSS imports
import './App.css';

// Create context for app state management
interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  apiBase: string;
  apiKey: string | null;
  userPreferences: Record<string, unknown>;
  updateUserPreferences: (prefs: Record<string, unknown>) => void;
}

export const AppContext = createContext<AppContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {},
  isLoading: false,
  setIsLoading: () => {},
  apiBase: import.meta.env.VITE_API_BASE_URL || '/api',
  apiKey: null,
  userPreferences: {},
  updateUserPreferences: () => {},
});

// Loading Component
const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  // State for context
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<Record<string, unknown>>({});
  
  // API Configuration
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const apiKey = import.meta.env.VITE_API_KEY || null;
  
  // Safety timeout to prevent infinite loading
  const loadingTimeoutRef = useRef<number | null>(null);
  
  // Handle loading state with safety timeout
  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a safety timeout to ensure loading doesn't get stuck
      loadingTimeoutRef.current = window.setTimeout(() => {
        console.warn('Loading timeout reached, forcing loading state to false');
        setIsLoading(false);
      }, 15000); // 15 seconds max loading time
    } else if (loadingTimeoutRef.current) {
      // Clear timeout when loading completes normally
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const updateUserPreferences = (prefs: Record<string, unknown>) => {
    setUserPreferences(current => ({
      ...current,
      ...prefs,
    }));
  };

  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      isLoading,
      setIsLoading,
      apiBase,
      apiKey,
      userPreferences,
      updateUserPreferences,
    }}>
      <HashRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingOverlay />}>
              <AppRoutes />
            </Suspense>
          </AnimatePresence>
          
          {isLoading && <LoadingOverlay />}
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
}

export default App;
