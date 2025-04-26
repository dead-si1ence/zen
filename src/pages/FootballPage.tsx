import { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFootballService } from '../services/football.service';
import { useAsync } from '../hooks/useAsync';
import { AppContext } from '../App';
import { FootballPrediction, FilterOptions } from '../types/models';
import SportPage from '../components/sports/SportPage';
import FootballPredictionCard from '../components/sports/FootballPredictionCard';
import footballIcon from '../assets/images/football-icon.svg';
import '../styles/SportPage.css';

import { FiFilter, FiSearch, FiList, FiTrendingUp, FiInfo, FiWifi, FiClock } from 'react-icons/fi';
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

const FootballPage = () => {
  const { setIsLoading } = useContext(AppContext);
  const footballService = useFootballService();
  const isMounted = useRef(true);

  // State
  const [activeTab, setActiveTab] = useState<'predictions' | 'competitions'>('predictions');
  const [selectedPrediction, setSelectedPrediction] = useState<FootballPrediction | null>(null);
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
  } = useAsync<FootballPrediction[]>(
    async () => {
      const response = await footballService.getPredictions({ ...filters, status: 'pending' });
      return response.data;
    },
    { 
      immediate: false, 
      onSuccess: () => {
        if (isMounted.current) setIsLoading(false);
      },
      onError: (err) => {
        if (isMounted.current) {
          setIsLoading(false);
          console.error('Error fetching football predictions:', err);
        }
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );
  
  const {
    execute: fetchCompetitions,
    loading: loadingCompetitions,
    error: errorCompetitions,
    value: competitions,
    isNetworkError: isCompetitionsNetworkError,
    isTimeoutError: isCompetitionsTimeoutError,
    retry: retryCompetitions,
  } = useAsync<string[]>(
    async () => {
      const response = await footballService.getCompetitions();
      return response.data;
    },
    { 
      immediate: false,
      onSuccess: () => {
        if (isMounted.current) setIsLoading(false);
      },
      onError: (err) => {
        if (isMounted.current) {
          setIsLoading(false);
          console.error('Error fetching competitions:', err);
        }
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  const loading = loadingPredictions || loadingCompetitions;
  const currentError = activeTab === 'predictions' ? errorPredictions : errorCompetitions;
  const isNetworkError = activeTab === 'predictions' ? isPredictionsNetworkError : isCompetitionsNetworkError;
  const isTimeoutError = activeTab === 'predictions' ? isPredictionsTimeoutError : isCompetitionsTimeoutError;

  const retryFunction = () => {
    if (activeTab === 'predictions') {
      retryPredictions();
    } else {
      retryCompetitions();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      setIsLoading(true);
      
      const safetyTimeout = setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 10000); // 10 second backup timeout
      
      const fetchData = async () => {
        try {
          if (activeTab === 'predictions') {
            await fetchPredictions();
          } else if (activeTab === 'competitions') {
            await fetchCompetitions();
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
  }, [activeTab, filters, fetchPredictions, fetchCompetitions]);

  const handlePredictionClick = (prediction: FootballPrediction) => {
    setSelectedPrediction(prediction);
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
            <motion.h2 variants={fadeIn} custom={0}>Football Match Predictions</motion.h2>
            
            {predictions && predictions.length > 0 ? (
              <motion.div className="prediction-grid">
                {predictions.map((prediction, index) => (
                  <motion.div key={prediction.id} variants={fadeIn} custom={index + 1}>
                    <FootballPredictionCard 
                      prediction={prediction} 
                      onClick={handlePredictionClick} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No upcoming match predictions</h3>
                <p>Check back soon for new predictions.</p>
              </div>
            )}
          </motion.div>
        );
      case 'competitions':
        return (
          <motion.div 
            className="competitions-container"
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Football Competitions</motion.h2>
            
            {competitions && competitions.length > 0 ? (
              <motion.div className="competitions-grid">
                {competitions.map((competition, index) => (
                  <motion.div 
                    key={competition} 
                    variants={fadeIn} 
                    custom={index + 1}
                    className="competition-card"
                  >
                    <h3>{competition}</h3>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No competitions available</h3>
                <p>Check back soon for competition data.</p>
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
          src={footballIcon} 
          alt="Football" 
          className="hero-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.h1 variants={fadeIn} custom={1}>Football Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          AI-driven match outcome predictions across global football leagues
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
          onClick={() => setActiveTab('predictions')}
          animate={activeTab === 'predictions' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiTrendingUp className="tab-icon" />
          Predictions
        </motion.button>
        <motion.button
          className={`sport-tab ${activeTab === 'competitions' ? 'active' : ''}`}
          onClick={() => setActiveTab('competitions')}
          animate={activeTab === 'competitions' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiList className="tab-icon" />
          Competitions
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
                  placeholder="Search team or competition..."
                  onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="competition">Competition:</label>
                <select 
                  id="competition"
                  onChange={(e) => handleFilterChange({ competition: e.target.value })}
                >
                  <option value="">All Competitions</option>
                  <option value="premier-league">Premier League</option>
                  <option value="la-liga">La Liga</option>
                  <option value="bundesliga">Bundesliga</option>
                  <option value="serie-a">Serie A</option>
                </select>
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
            className="particle football-particle"
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
      
      {/* Selected Prediction Modal */}
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
            <h3>{selectedPrediction.homeTeam.name} vs. {selectedPrediction.awayTeam.name}</h3>
            <p className="modal-competition">{selectedPrediction.competition}</p>
            <p className="modal-date">Date: {new Date(selectedPrediction.date).toLocaleDateString()}</p>
            {/* Add more prediction details */}
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  return (
    <SportPage 
      title="Football"
      sportType="football"
      fallbackImageSrc="/zen/football-background.jpg"
    >
      {content}
    </SportPage>
  );
};

export default FootballPage;