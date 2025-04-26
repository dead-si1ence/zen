import { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEsportsService } from '../services/esports.service';
import { useAsync } from '../hooks/useAsync';
import { AppContext } from '../App';
import { EsportsPrediction, FilterOptions } from '../types/models';
import SportPage from '../components/sports/SportPage';
import EsportsPredictionCard from '../components/sports/EsportsPredictionCard';
import esportsIcon from '../assets/images/esports-icon.svg';
import '../styles/SportPage.css';

import { FiMonitor, FiAward, FiTrendingUp, FiFilter, FiInfo, FiWifi, FiClock } from 'react-icons/fi';
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

const EsportsPage = () => {
  const { setIsLoading } = useContext(AppContext);
  const esportsService = useEsportsService();
  const isMounted = useRef(true);

  // State
  const [activeTab, setActiveTab] = useState<'predictions' | 'games' | 'tournaments'>('predictions');
  const [selectedPrediction, setSelectedPrediction] = useState<EsportsPrediction | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Set mounted ref on mount and cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    console.log('EsportsPage mounted');
    return () => {
      isMounted.current = false;
      setIsLoading(false);
      console.log('EsportsPage unmounted');
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
  } = useAsync<EsportsPrediction[]>(
    async () => {
      try {
        console.log('Fetching esports predictions');
        const response = await esportsService.getPredictions({ ...filters, status: 'pending' });
        console.log('Esports predictions received:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching esports predictions:', error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    {
      immediate: true, // Always fetch on mount
      onSuccess: () => {
        if (isMounted.current) {
          setIsLoading(false);
          console.log('Predictions loaded successfully');
        }
      },
      onError: (err) => {
        if (isMounted.current) {
          setIsLoading(false);
          console.error('Error in predictions hook:', err);
        }
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );
  
  const {
    execute: fetchGames,
    loading: loadingGames,
    error: errorGames,
    value: games,
    isNetworkError: isGamesNetworkError,
    isTimeoutError: isGamesTimeoutError,
    retry: retryGames,
  } = useAsync<string[]>(
    async () => {
      try {
        console.log('Fetching esports games');
        const response = await esportsService.getGames();
        console.log('Esports games received:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching esports games:', error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    { 
      immediate: false,
      onSuccess: () => {
        if (isMounted.current) {
          setIsLoading(false);
          console.log('Games loaded successfully');
        }
      },
      onError: (err) => {
        if (isMounted.current) {
          setIsLoading(false);
          console.error('Error in games hook:', err);
        }
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );
  
  const {
    execute: fetchTournaments,
    loading: loadingTournaments,
    error: errorTournaments,
    value: tournaments,
    isNetworkError: isTournamentsNetworkError,
    isTimeoutError: isTournamentsTimeoutError,
    retry: retryTournaments,
  } = useAsync<string[]>(
    async (game: string) => {
      try {
        console.log('Fetching tournaments for game:', game);
        const response = await esportsService.getTournaments(game);
        console.log('Tournaments received:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        if (isMounted.current) setIsLoading(false);
        throw error;
      }
    },
    { 
      immediate: false,
      onSuccess: () => {
        if (isMounted.current) {
          setIsLoading(false);
          console.log('Tournaments loaded successfully');
        }
      },
      onError: (err) => {
        if (isMounted.current) {
          setIsLoading(false);
          console.error('Error in tournaments hook:', err);
        }
      },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  const loading = loadingPredictions || loadingGames || 
                 (activeTab === 'tournaments' && selectedGame && loadingTournaments);
  
  const currentError = activeTab === 'predictions' ? errorPredictions : 
                      activeTab === 'games' ? errorGames : 
                      errorTournaments;
  
  const isNetworkError = activeTab === 'predictions' ? isPredictionsNetworkError : 
                          activeTab === 'games' ? isGamesNetworkError : 
                          isTournamentsNetworkError;
  
  const isTimeoutError = activeTab === 'predictions' ? isPredictionsTimeoutError : 
                          activeTab === 'games' ? isGamesTimeoutError : 
                          isTournamentsTimeoutError;
                 
  const retryFunction = () => {
    if (activeTab === 'predictions') {
      retryPredictions();
    } else if (activeTab === 'games') {
      retryGames();
    } else if (activeTab === 'tournaments' && selectedGame) {
      retryTournaments(selectedGame);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      setIsLoading(true);
      
      // Set a safety timeout to prevent infinite loading
      const safetyTimeout = setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 1000); // 1 second backup timeout
      
      const fetchData = async () => {
        try {
          if (activeTab === 'predictions') {
            await fetchPredictions();
          } else if (activeTab === 'games') {
            await fetchGames();
          } else if (activeTab === 'tournaments') {
            if (selectedGame) {
              await fetchTournaments(selectedGame);
            } else {
              await fetchGames();
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${activeTab}:`, error);
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
        if (isMounted.current) setIsLoading(false);
      };
    }
  }, [activeTab, filters, selectedGame, fetchPredictions, fetchGames, fetchTournaments]);

  // Add debug logging to check if data is being received
  console.log('EsportsPage - current data state:', {
    predictions,
    games,
    tournaments,
    loadingPredictions,
    loadingGames,
    loadingTournaments,
    errorPredictions,
    errorGames,
    errorTournaments
  });

  const handlePredictionClick = (prediction: EsportsPrediction) => {
    setSelectedPrediction(prediction);
    console.log('Selected prediction:', prediction);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleGameSelectForTournaments = (game: string) => {
    setSelectedGame(game);
    console.log('Selected game for tournaments:', game);
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
    // Show loading state only if data hasn't been loaded yet
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
            <motion.h2 variants={fadeIn} custom={0}>Esports Match Predictions</motion.h2>
            
            {predictions && predictions.length > 0 ? (
              <motion.div className="prediction-grid">
                {predictions.map((prediction, index) => (
                  <motion.div key={prediction.id} variants={fadeIn} custom={index + 1}>
                    <EsportsPredictionCard 
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
                <p>Check back soon for new esports predictions.</p>
              </div>
            )}
          </motion.div>
        );
      case 'games':
        return (
          <motion.div 
            className="games-container"
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Esports Games</motion.h2>
            
            {games && games.length > 0 ? (
              <motion.div className="games-grid">
                {games.map((game, index) => (
                  <motion.div 
                    key={game} 
                    variants={fadeIn} 
                    custom={index + 1}
                    className="game-card"
                    onClick={() => {
                      setActiveTab('tournaments');
                      handleGameSelectForTournaments(game);
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(187, 134, 252, 0.2)' }}
                  >
                    <h3>{game}</h3>
                    <p>View tournaments &rarr;</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No games available</h3>
                <p>Check back soon for esports game data.</p>
              </div>
            )}
          </motion.div>
        );
      case 'tournaments':
        return (
          <motion.div
            className="tournaments-container"
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
          >
            {!selectedGame && games && (
              <>
                <motion.h2 variants={fadeIn} custom={0}>Select a Game</motion.h2>
                <motion.div className="games-grid">
                  {games.map((game, index) => (
                    <motion.div 
                      key={game} 
                      variants={fadeIn} 
                      custom={index + 1}
                      className="game-card"
                      onClick={() => handleGameSelectForTournaments(game)}
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(187, 134, 252, 0.2)' }}
                    >
                      <h3>{game}</h3>
                      <p>View tournaments &rarr;</p>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
            
            {selectedGame && !loadingTournaments && !errorTournaments && (
              <>
                <motion.div className="tournaments-header" variants={fadeIn} custom={0}>
                  <h2>{selectedGame} Tournaments</h2>
                  <button 
                    className="back-button"
                    onClick={() => setSelectedGame(null)}
                  >
                    &larr; Back to Games
                  </button>
                </motion.div>

                {tournaments && tournaments.length > 0 ? (
                  <motion.div className="tournaments-grid">
                    {tournaments.map((tournament, index) => (
                      <motion.div 
                        key={tournament} 
                        variants={fadeIn} 
                        custom={index + 1}
                        className="tournament-card"
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(3, 218, 198, 0.15)' }}
                      >
                        <h3>{tournament}</h3>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="empty-state">
                    <FiInfo size={48} className="empty-state-icon" />
                    <h3>No tournaments found for {selectedGame}</h3>
                    <p>Check back soon for tournament data.</p>
                  </div>
                )}
              </>
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
          src={esportsIcon}
          alt="Esports Icon"
          className="hero-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.h1 variants={fadeIn} custom={1}>Esports Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          Advanced AI predictions for your favorite esports games and tournaments
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
          className={`sport-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
          animate={activeTab === 'games' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiMonitor className="tab-icon" />
          Games
        </motion.button>
        <motion.button
          className={`sport-tab ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => setActiveTab('tournaments')}
          animate={activeTab === 'tournaments' ? 'active' : 'inactive'}
          variants={tabVariants}
        >
          <FiAward className="tab-icon" />
          Tournaments
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
                  placeholder="Search game or team..."
                  onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="game">Game:</label>
                <select 
                  id="game"
                  onChange={(e) => handleFilterChange({ game: e.target.value })}
                >
                  <option value="">All Games</option>
                  <option value="league-of-legends">League of Legends</option>
                  <option value="dota-2">Dota 2</option>
                  <option value="cs2">CS2</option>
                  <option value="valorant">Valorant</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.section
        className="tab-content-section"
        key={activeTab + (selectedGame || '')}
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
            className="particle esports-particle"
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
            <h3>{selectedPrediction.team1?.name || 'Team 1'} vs. {selectedPrediction.team2?.name || 'Team 2'}</h3>
            <p className="modal-game">{selectedPrediction.game}</p>
            <p className="modal-tournament">{selectedPrediction.tournament}</p>
            <p className="modal-date">Date: {selectedPrediction.date ? new Date(selectedPrediction.date).toLocaleDateString() : 'TBD'}</p>
            
            <div className="prediction-details">
              <p className="winner">
                <strong>Predicted Winner:</strong> {selectedPrediction.prediction?.winner || 'Unknown'}
              </p>
              <p className="confidence">
                <strong>Confidence:</strong> {selectedPrediction.prediction?.confidence 
                  ? `${Math.round(selectedPrediction.prediction.confidence * 100)}%`
                  : 'N/A'}
              </p>
              {selectedPrediction.prediction?.score && (
                <p className="score">
                  <strong>Predicted Score:</strong> {selectedPrediction.prediction.score}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  return (
    <SportPage
      title="Esports"
      sportType="esports"
      fallbackImageSrc="/zen/esports-background.jpg"
    >
      {content}
    </SportPage>
  );
};

export default EsportsPage;