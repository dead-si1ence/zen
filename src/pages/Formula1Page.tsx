import { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFormula1Service } from '../services/formula1.service';
import Formula1PredictionCard from '../components/sports/Formula1PredictionCard';
import SportPage from '../components/sports/SportPage';
import { Formula1Prediction, Driver, Constructor, FilterOptions } from '../types/models';
import { useAsync } from '../hooks/useAsync';
import { AppContext } from '../App';
import '../styles/SportPage.css';
import '../styles/Formula1Page.css';

import { FiUsers, FiTool, FiTrendingUp, FiFilter, FiInfo, FiWifi, FiClock } from 'react-icons/fi';
import f1Icon from '../assets/images/f1-icon.svg';
import { getErrorMessage } from '../utils/helpers';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const tabVariants = {
  active: {
    color: 'var(--primary-accent)',
    borderBottom: '2px solid var(--primary-accent)',
    transition: { duration: 0.3 }
  },
  inactive: {
    color: 'var(--text-secondary)',
    borderBottom: '2px solid transparent',
    transition: { duration: 0.3 }
  }
};

const Formula1Page: React.FC = () => {
  const { setIsLoading } = useContext(AppContext);
  const f1Service = useFormula1Service();
  const isMounted = useRef(true);

  // State
  const [activeTab, setActiveTab] = useState<'predictions' | 'drivers' | 'constructors'>('predictions');
  const [selectedPrediction, setSelectedPrediction] = useState<Formula1Prediction | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedConstructor, setSelectedConstructor] = useState<Constructor | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      setIsLoading(false);
    };
  }, [setIsLoading]);

  const {
    execute: fetchPredictions,
    loading: loadingPredictions,
    error: errorPredictions,
    value: predictions,
    isNetworkError: isPredictionsNetworkError,
    isTimeoutError: isPredictionsTimeoutError,
    retry: retryPredictions,
  } = useAsync<Formula1Prediction[]>(
    async () => {
      try {
        const response = await f1Service.getPredictions({ ...filters, status: 'pending' });
        return response.data;
      } catch (error) {
        console.error('Error fetching F1 predictions:', error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    {
      immediate: false,
      onSuccess: () => {
        if (isMounted.current) setIsLoading(false);
      },
      onError: () => {
        if (isMounted.current) setIsLoading(false);
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  const {
    execute: fetchDrivers,
    loading: loadingDrivers,
    error: errorDrivers,
    value: drivers,
    isNetworkError: isDriversNetworkError,
    isTimeoutError: isDriversTimeoutError,
    retry: retryDrivers,
  } = useAsync<Driver[]>(
    async () => {
      try {
        const response = await f1Service.getAllDrivers();
        return response.data;
      } catch (error) {
        console.error('Error fetching F1 drivers:', error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    { 
      immediate: false, 
      onSuccess: () => {
        if (isMounted.current) setIsLoading(false);
      },
      onError: () => {
        if (isMounted.current) setIsLoading(false);
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  const {
    execute: fetchConstructors,
    loading: loadingConstructors,
    error: errorConstructors,
    value: constructors,
    isNetworkError: isConstructorsNetworkError,
    isTimeoutError: isConstructorsTimeoutError,
    retry: retryConstructors,
  } = useAsync<Constructor[]>(
    async () => {
      try {
        const response = await f1Service.getAllConstructors();
        return response.data;
      } catch (error) {
        console.error('Error fetching F1 constructors:', error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    { 
      immediate: false, 
      onSuccess: () => {
        if (isMounted.current) setIsLoading(false);
      },
      onError: () => {
        if (isMounted.current) setIsLoading(false);
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  const loading = loadingPredictions || loadingDrivers || loadingConstructors;
  const currentError = activeTab === 'predictions' ? errorPredictions :
                      activeTab === 'drivers' ? errorDrivers :
                      errorConstructors;
  
  const isNetworkError = activeTab === 'predictions' ? isPredictionsNetworkError :
                        activeTab === 'drivers' ? isDriversNetworkError :
                        isConstructorsNetworkError;
  
  const isTimeoutError = activeTab === 'predictions' ? isPredictionsTimeoutError :
                        activeTab === 'drivers' ? isDriversTimeoutError :
                        isConstructorsTimeoutError;

  const retryFunction = () => {
    if (activeTab === 'predictions') {
      retryPredictions();
    } else if (activeTab === 'drivers') {
      retryDrivers();
    } else {
      retryConstructors();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      setIsLoading(true);
      
      // Set a safety timeout to ensure loading state doesn't get stuck
      const safetyTimeout = setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 10000); // 10 second backup timeout
      
      const fetchData = async () => {
        try {
          if (activeTab === 'predictions') {
            await fetchPredictions();
          } else if (activeTab === 'drivers') {
            await fetchDrivers();
          } else if (activeTab === 'constructors') {
            await fetchConstructors();
          }
        } finally {
          clearTimeout(safetyTimeout);
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      };
      
      fetchData();
      
      return () => {
        clearTimeout(safetyTimeout);
      };
    }
  }, [activeTab, filters, fetchPredictions, fetchDrivers, fetchConstructors]);

  const handlePredictionClick = (prediction: Formula1Prediction) => {
    setSelectedPrediction(prediction);
  };

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleConstructorClick = (constructor: Constructor) => {
    setSelectedConstructor(constructor);
  };

  const handleTabChange = (tab: 'predictions' | 'drivers' | 'constructors') => {
    setActiveTab(tab);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Render error state with improved error message display
  const renderErrorState = () => {
    const errorMessage = getErrorMessage(currentError);
    
    return (
      <motion.div 
        className="error-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isNetworkError ? (
          <>
            <FiWifi size={48} className="error-icon" />
            <h3>Network Connection Error</h3>
            <p>{errorMessage}</p>
            <button onClick={retryFunction} className="retry-button">
              Try Again
            </button>
          </>
        ) : isTimeoutError ? (
          <>
            <FiClock size={48} className="error-icon" />
            <h3>Request Timeout</h3>
            <p>{errorMessage}</p>
            <button onClick={retryFunction} className="retry-button">
              Try Again
            </button>
          </>
        ) : (
          <>
            <FiInfo size={48} className="error-icon" />
            <h3>Something went wrong</h3>
            <p>{errorMessage}</p>
            <button onClick={retryFunction} className="retry-button">
              Try Again
            </button>
          </>
        )}
      </motion.div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <motion.div 
          className="loading-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="zen-spinner"></div>
          <p>Loading {activeTab}...</p>
        </motion.div>
      );
    }
    
    if (currentError) {
      return renderErrorState();
    }

    switch (activeTab) {
      case 'predictions':
        return (
          <motion.div
            className="predictions-container"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Race Predictions</motion.h2>
            
            {predictions && predictions.length > 0 ? (
              <motion.div className="prediction-grid">
                {predictions.map((prediction, index) => (
                  <motion.div key={prediction.id} variants={fadeIn} custom={index + 1}>
                    <Formula1PredictionCard
                      prediction={prediction}
                      onClick={() => handlePredictionClick(prediction)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No upcoming race predictions</h3>
                <p>Check back soon for new race predictions.</p>
              </div>
            )}
          </motion.div>
        );
      case 'drivers':
        return (
          <motion.div
            className="drivers-container"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Formula 1 Drivers</motion.h2>
            
            {drivers && drivers.length > 0 ? (
              <motion.div className="drivers-grid">
                {drivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    variants={fadeIn}
                    custom={index + 1}
                    className="driver-card"
                    onClick={() => handleDriverClick(driver)}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(187, 134, 252, 0.15)' }}
                  >
                    <img src={driver.image || '/zen/placeholder.png'} alt={driver.name} className="driver-image" />
                    <h3>{driver.name}</h3>
                    <p>{driver.team}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No driver information available</h3>
                <p>Check back soon for driver data.</p>
              </div>
            )}
          </motion.div>
        );
      case 'constructors':
        return (
          <motion.div
            className="constructors-container"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Formula 1 Constructors</motion.h2>
            
            {constructors && constructors.length > 0 ? (
              <motion.div className="constructors-grid">
                {constructors.map((constructor, index) => (
                  <motion.div
                    key={constructor.id}
                    variants={fadeIn}
                    custom={index + 1}
                    className="constructor-card"
                    onClick={() => handleConstructorClick(constructor)}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(3, 218, 198, 0.15)' }}
                  >
                    <img src={constructor.image || '/zen/placeholder.png'} alt={constructor.name} className="constructor-image" />
                    <h3>{constructor.name}</h3>
                    <p>Points: {constructor.points ?? 'N/A'}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No constructor information available</h3>
                <p>Check back soon for constructor data.</p>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  const content = (
    <div className="sport-page-container">
      <motion.div
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.img
          src={f1Icon}
          alt="Formula 1 Icon"
          className="hero-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.h1 variants={fadeIn} custom={1}>Formula 1 Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          AI-powered race predictions using historical data, driver statistics, and track conditions
        </motion.p>
      </motion.div>

      <motion.div
        className="sport-tabs"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.button
          className={`sport-tab ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => handleTabChange('predictions')}
          animate={activeTab === 'predictions' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiTrendingUp className="tab-icon" />
          Predictions
        </motion.button>
        <motion.button
          className={`sport-tab ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => handleTabChange('drivers')}
          animate={activeTab === 'drivers' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiUsers className="tab-icon" />
          Drivers
        </motion.button>
        <motion.button
          className={`sport-tab ${activeTab === 'constructors' ? 'active' : ''}`}
          onClick={() => handleTabChange('constructors')}
          animate={activeTab === 'constructors' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiTool className="tab-icon" />
          Constructors
        </motion.button>
      </motion.div>

      {/* Filter Controls - Only show on predictions tab and not during loading or error */}
      {activeTab === 'predictions' && !loading && !currentError && (
        <motion.div 
          className={`filter-control-bar ${isFiltersOpen ? 'open' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            className="filter-toggle"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            aria-expanded={isFiltersOpen}
          >
            <FiFilter />
            {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {isFiltersOpen && (
            <motion.div 
              className="filter-controls"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="filter-group">
                <label htmlFor="search">Search:</label>
                <input 
                  id="search"
                  type="text" 
                  placeholder="Search race or driver..."
                  onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.section
        className="tab-content-section"
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderTabContent()}
      </motion.section>

      {/* Floating particles for visual effect */}
      <motion.div className="floating-particles">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="particle f1-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.1,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          />
        ))}
      </motion.div>

      {/* Selected Item Modals */}
      {selectedPrediction && (
        <motion.div 
          className="prediction-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="prediction-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button className="close-modal" onClick={() => setSelectedPrediction(null)}>✕</button>
            <h3>{selectedPrediction.raceName}</h3>
            <p className="modal-date">Date: {new Date(selectedPrediction.date).toLocaleDateString()}</p>
            {/* Add more prediction details */}
          </motion.div>
        </motion.div>
      )}

      {selectedDriver && (
        <motion.div 
          className="prediction-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="prediction-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button className="close-modal" onClick={() => setSelectedDriver(null)}>✕</button>
            <h3>{selectedDriver.name}</h3>
            <p className="modal-team">Team: {selectedDriver.team}</p>
            {/* Add more driver details */}
          </motion.div>
        </motion.div>
      )}

      {selectedConstructor && (
        <motion.div 
          className="prediction-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="prediction-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button className="close-modal" onClick={() => setSelectedConstructor(null)}>✕</button>
            <h3>{selectedConstructor.name}</h3>
            <p className="modal-points">Points: {selectedConstructor.points}</p>
            {/* Add more constructor details */}
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  return (
    <SportPage
      title="Formula 1"
      sportType="formula1"
      fallbackImageSrc="/zen/f1-background.jpg"
    >
      {content}
    </SportPage>
  );
};

export default Formula1Page;