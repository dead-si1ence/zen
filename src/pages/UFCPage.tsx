import { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../App';
import { useUFCService } from '../services/ufc.service';
import { useAsync } from '../hooks/useAsync';
import { UFCPrediction, FilterOptions } from '../types/models';

import SportPage from '../components/sports/SportPage';
import UFCPredictionCard from '../components/sports/UFCPredictionCard';
import ufcIcon from '../assets/images/ufc-icon.svg';
import ufcBackgroundVideo from '../assets/videos/ufc-background.mp4';

import { FiFilter, FiSearch, FiInfo, FiCalendar, FiBarChart, FiWifi, FiClock } from 'react-icons/fi';
import { getErrorMessage } from '../utils/helpers';

// Import UFC-specific styles
import '../styles/SportPage.css';
import '../styles/UFCPage.css';

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

// Dummy UFC data for development purposes
const dummyUFCUpcomingData: UFCPrediction[] = [
  {
    id: "ufc-001",
    sport: "ufc",
    status: "pending",
    event: "UFC 300: Championship Title",
    fighter1: {
      id: "f1",
      name: "Jon Jones",
      record: "26-1-0",
      stats: {
        wins: 26,
        losses: 1,
        draws: 0,
        knockouts: 10,
        submissions: 7,
      },
    },
    fighter2: {
      id: "f2",
      name: "Israel Adesanya",
      record: "23-2-0",
      stats: {
        wins: 23,
        losses: 2,
        draws: 0,
        knockouts: 15,
        submissions: 0,
      },
    },
    date: "2025-05-15",
    prediction: {
      winner: "f1",
      confidence: 85,
      method: "TKO",
      round: 3,
    },
    predictedWinner: "f1",
    predictedMethod: "TKO",
    predictedRound: 3,
    confidence: 85,
    explanation:
      "Jones has superior wrestling and reach advantage. Expect him to wear down Adesanya and finish with ground and pound in the third round.",
  },
];

const dummyUFCHistoryData: UFCPrediction[] = [
  {
    id: 'ufc-h001',
    sport: 'ufc',
    status: 'correct',
    event: 'UFC 299: Miami',
    fighter1: {
      id: 'f7',
      name: 'Dustin Poirier',
      record: '29-8-0',
      stats: {
        wins: 29,
        losses: 8,
        draws: 0,
        knockouts: 14,
        submissions: 8
      }
    },
    fighter2: {
      id: 'f8',
      name: 'Justin Gaethje',
      record: '24-4-0',
      stats: {
        wins: 24,
        losses: 4,
        draws: 0,
        knockouts: 20,
        submissions: 1
      }
    },
    date: '2025-03-09',
    prediction: {
      winner: 'f7',
      confidence: 60,
      method: 'Submission',
      round: 3
    },
    predictedWinner: 'f7',
    predictedMethod: 'Submission',
    predictedRound: 3,
    confidence: 60,
    explanation: 'Poirier has the more well-rounded skill set and should be able to capitalize on Gaethje\'s aggression with a submission in the later rounds.'
  },
  {
    id: 'ufc-h002',
    sport: 'ufc',
    status: 'incorrect',
    event: 'UFC Fight Night: London',
    fighter1: {
      id: 'f9',
      name: 'Leon Edwards',
      record: '21-3-0',
      stats: {
        wins: 21,
        losses: 3,
        draws: 0,
        knockouts: 7,
        submissions: 3
      }
    },
    fighter2: {
      id: 'f10',
      name: 'Belal Muhammad',
      record: '22-3-0',
      stats: {
        wins: 22,
        losses: 3,
        draws: 0,
        knockouts: 5,
        submissions: 1
      }
    },
    date: '2025-02-22',
    prediction: {
      winner: 'f9',
      confidence: 70,
      method: 'Decision',
      round: 5
    },
    predictedWinner: 'f9',
    predictedMethod: 'Decision',
    predictedRound: 5,
    confidence: 70,
    explanation: 'Edwards has superior striking and should be able to keep this fight on the feet to secure a decision victory.'
  },
  {
    id: 'ufc-h003',
    sport: 'ufc',
    status: 'correct',
    event: 'UFC 298: California',
    fighter1: {
      id: 'f11',
      name: 'Alex Pereira',
      record: '9-2-0',
      stats: {
        wins: 9,
        losses: 2,
        draws: 0,
        knockouts: 7,
        submissions: 0
      }
    },
    fighter2: {
      id: 'f12',
      name: 'Jamahal Hill',
      record: '12-1-0',
      stats: {
        wins: 12,
        losses: 1,
        draws: 0,
        knockouts: 7,
        submissions: 0
      }
    },
    date: '2025-01-20',
    prediction: {
      winner: 'f11',
      confidence: 75,
      method: 'KO/TKO',
      round: 2
    },
    predictedWinner: 'f11',
    predictedMethod: 'KO/TKO',
    predictedRound: 2,
    confidence: 75,
    explanation: 'Pereira has the edge in power and striking technique. His kickboxing background and experience will be the deciding factor.'
  }
];

const UFCPage = () => {
  const { setIsLoading } = useContext(AppContext);
  const ufcService = useUFCService();
  const isMounted = useRef(true);

  // State
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'custom'>('upcoming');
  const [selectedPrediction, setSelectedPrediction] = useState<UFCPrediction | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Set mounted ref on mount and cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      setIsLoading(false);
    };
  }, [setIsLoading]);

  // Use custom async hook for data fetching
  const {
    execute: fetchPredictions,
    loading,
    error,
    value: predictionsRaw,
    isNetworkError,
    isTimeoutError,
    retry,
  } = useAsync<UFCPrediction[]>(
    async () => {
      // Different filter based on active tab
      let filterOptions: FilterOptions = { ...filters };
      
      if (activeTab === 'upcoming') {
        filterOptions.status = 'pending';
      } else if (activeTab === 'history') {
        filterOptions.status = 'correct';
      }
      
      try {
        const response = await ufcService.getPredictions(filterOptions);
        // If API returns empty, fallback to dummy
        if (!response.data || response.data.length === 0) {
          return activeTab === 'upcoming' ? dummyUFCUpcomingData : dummyUFCHistoryData;
        }
        return response.data;
      } catch (err) {
        // Always fallback to dummy data on error
        return activeTab === 'upcoming' ? dummyUFCUpcomingData : dummyUFCHistoryData;
      }
    }, 
    {
      onSuccess: () => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      },
      onError: () => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  // Load predictions when component mounts or filters change
  useEffect(() => {
    if (isMounted.current) {
      setIsLoading(true);
      
      // Set a safety timeout to ensure loading state doesn't get stuck
      const safetyTimeout = setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 10000); // 10 second backup timeout
      
      fetchPredictions().finally(() => {
        clearTimeout(safetyTimeout);
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
      
      // Cleanup function to handle component unmount during loading
      return () => {
        clearTimeout(safetyTimeout);
      };
    }
  }, [activeTab, filters]);

  // Handle prediction card click
  const handlePredictionClick = (prediction: UFCPrediction) => {
    setSelectedPrediction(prediction);
    // Additional logic for showing prediction details modal
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Render error state with improved error message display
  const renderErrorState = () => {
    const errorMessage = getErrorMessage(error);
    
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
            <button onClick={() => retry()} className="retry-button">
              Try Again
            </button>
          </>
        ) : isTimeoutError ? (
          <>
            <FiClock size={48} className="error-icon" />
            <h3>Request Timeout</h3>
            <p>{errorMessage}</p>
            <button onClick={() => retry()} className="retry-button">
              Try Again
            </button>
          </>
        ) : (
          <>
            <FiInfo size={48} className="error-icon" />
            <h3>Something went wrong</h3>
            <p>{errorMessage}</p>
            <button onClick={() => retry()} className="retry-button">
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
          <p>Loading predictions...</p>
        </motion.div>
      );
    }
    
    if (error) {
      return renderErrorState();
    }

    const predictions = predictionsRaw || [];

    switch (activeTab) {
      case 'upcoming':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="predictions-container"
          >
            <motion.h2 variants={fadeIn} custom={0}>Upcoming UFC Fight Predictions</motion.h2>
            
            {predictions.length > 0 ? (
              <motion.div className="prediction-grid">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    variants={fadeIn}
                    custom={index + 1}
                  >
                    <UFCPredictionCard 
                      prediction={prediction} 
                      onClick={handlePredictionClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No upcoming fight predictions</h3>
                <p>Check back soon for new predictions or try a custom matchup.</p>
              </div>
            )}
          </motion.div>
        );
      case 'history':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="predictions-container"
          >
            <motion.h2 variants={fadeIn} custom={0}>Past UFC Fight Predictions</motion.h2>
            
            {predictions.length > 0 ? (
              <motion.div className="prediction-grid">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    variants={fadeIn}
                    custom={index + 1}
                  >
                    <UFCPredictionCard 
                      prediction={prediction} 
                      onClick={handlePredictionClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No past predictions found</h3>
                <p>Check back after some upcoming fights are completed.</p>
              </div>
            )}
          </motion.div>
        );
      case 'custom':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="custom-matchup-container"
          >
            <motion.h2 variants={fadeIn} custom={0}>Create a Custom Matchup</motion.h2>
            <motion.p variants={fadeIn} custom={1} className="section-description">
              Select two fighters to generate an AI prediction for a hypothetical matchup
            </motion.p>
            
            <motion.div variants={fadeIn} custom={2} className="custom-matchup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fighter1">Fighter 1</label>
                  <select id="fighter1" disabled>
                    <option>Select Fighter 1</option>
                  </select>
                </div>
                
                <div className="vs-indicator">VS</div>
                
                <div className="form-group">
                  <label htmlFor="fighter2">Fighter 2</label>
                  <select id="fighter2" disabled>
                    <option>Select Fighter 2</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="event">Event</label>
                <select id="event" disabled>
                  <option>Select Event</option>
                </select>
              </div>
              
              <button className="generate-button" disabled>
                Generate Prediction
              </button>
              
              <p className="coming-soon-notice">
                Custom matchup predictions coming soon!
              </p>
            </motion.div>
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
          src={ufcIcon}
          alt="UFC Icon"
          className="hero-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.h1 variants={fadeIn} custom={1}>UFC / MMA Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          AI-powered fight predictions with detailed analysis and statistics
        </motion.p>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div 
        className="sport-tabs"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.button
          className={`sport-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
          animate={activeTab === 'upcoming' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiCalendar className="tab-icon" />
          Upcoming Fights
        </motion.button>
        <motion.button
          className={`sport-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          animate={activeTab === 'history' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiBarChart className="tab-icon" />
          Past Predictions
        </motion.button>
        <motion.button
          className={`sport-tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
          animate={activeTab === 'custom' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiSearch className="tab-icon" />
          Custom Matchup
        </motion.button>
      </motion.div>

      {/* Filter Controls - Only show on predictions tabs and not during loading or error */}
      {(activeTab === 'upcoming' || activeTab === 'history') && !loading && !error && (
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
                  placeholder="Search fighter name..."
                  onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="confidence">Min. Confidence:</label>
                <select 
                  id="confidence"
                  onChange={(e) => handleFilterChange({ 
                    confidenceRange: {
                      min: parseInt(e.target.value),
                      max: 100
                    }
                  })}
                >
                  <option value="0">Any</option>
                  <option value="50">50%+</option>
                  <option value="75">75%+</option>
                  <option value="90">90%+</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
        
      {/* Content based on active tab */}
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
            className="particle ufc-particle"
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
            <h3>{selectedPrediction.fighter1.name} vs. {selectedPrediction.fighter2.name}</h3>
            <p className="modal-event">{selectedPrediction.event}</p>
            {/* Modal content would expand with more details */}
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  return (
    <SportPage 
      title="UFC / MMA Predictions" 
      sportType="ufc"
      videoSrc={ufcBackgroundVideo}
      fallbackImageSrc="/zen/ufc-background.jpg"
    >
      {content}
    </SportPage>
  );
};

export default UFCPage;