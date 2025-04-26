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

// Helper functions for game/tournament info
const getGameDescription = (game: string): string => {
  const descriptions: Record<string, string> = {
    'League of Legends': 'A team-based strategy game where two teams of five champions battle to destroy the enemy base.',
    'Counter-Strike 2': 'A tactical first-person shooter pitting terrorists against counter-terrorists.',
    'Dota 2': 'A complex multiplayer online battle arena where two teams of five battle to destroy the enemy Ancient.',
    'Valorant': 'A character-based tactical shooter from Riot Games featuring unique agent abilities.',
    'Overwatch 2': 'A team-based first-person shooter featuring heroes with unique abilities working together.',
    'Rocket League': 'A vehicular soccer game combining cars and football in a high-octane competition.',
    'Fortnite': 'A battle royale game featuring building mechanics and last-player-standing gameplay.'
  };
  
  return descriptions[game] || 'An exciting competitive esports title.';
};

const getTournamentDescription = (tournament: string): string => {
  const descriptions: Record<string, string> = {
    'World Championship': 'The premier global tournament featuring the top teams from each region.',
    'Mid-Season Invitational': 'A mid-year tournament featuring the spring split champions from each region.',
    'ESL Pro League': 'One of the longest-running professional leagues featuring top CS2 teams.',
    'BLAST Premier': 'A global tournament circuit with multiple events throughout the year.',
    'The International': 'Dota 2\'s largest annual tournament with one of gaming\'s biggest prize pools.'
  };
  
  return descriptions[tournament] || 'A prestigious tournament featuring the world\'s best teams.';
};

const getTournamentDate = (tournament: string): string => {
  const dates: Record<string, string> = {
    'World Championship': 'Oct - Nov 2025',
    'Mid-Season Invitational': 'May 2025',
    'ESL Pro League': 'August - October 2025',
    'BLAST Premier': 'April - December 2025',
    'The International': 'August 2025'
  };
  
  return dates[tournament] || 'Coming in 2025';
};

const getTournamentPrize = (tournament: string): string => {
  const prizes: Record<string, string> = {
    'World Championship': '$2,500,000 USD',
    'Mid-Season Invitational': '$1,000,000 USD',
    'ESL Pro League': '$850,000 USD',
    'BLAST Premier': '$1,250,000 USD',
    'The International': '$40,000,000+ USD'
  };
  
  return prizes[tournament] || '$500,000+ USD';
};

const getTournamentLocation = (tournament: string): string => {
  const locations: Record<string, string> = {
    'World Championship': 'Seoul, South Korea',
    'Mid-Season Invitational': 'Paris, France',
    'ESL Pro League': 'Malta',
    'BLAST Premier': 'Copenhagen, Denmark',
    'The International': 'Seattle, USA'
  };
  
  return locations[tournament] || 'TBA';
};

const handleGameSelect = (game: string) => {
  setSelectedGame(game);
  // Fetch tournaments for this game
  fetchTournaments(game);
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

  // Hardcoded data for fallback
  const hardcodedPredictions = [
    {
      id: 'esports1',
      team1: 'T1',
      team2: 'G2 Esports',
      game: 'League of Legends',
      winner: 'T1',
      score: '3-1',
      confidence: 70,
      date: '2025-05-14',
      mvp: 'Faker'
    },
    {
      id: 'esports2',
      team1: 'Natus Vincere',
      team2: 'FaZe Clan',
      game: 'Counter-Strike 2',
      winner: 'Natus Vincere',
      score: '16-14',
      confidence: 65,
      date: '2025-05-16',
      mvp: 's1mple'
    }
  ];

  const hardcodedGames = [
    'League of Legends',
    'Counter-Strike 2',
    'Dota 2',
    'Valorant',
    'Overwatch 2'
  ];

  const hardcodedTournaments = [
    'World Championship',
    'Mid-Season Invitational',
    'ESL Pro League',
    'BLAST Premier',
    'The International'
  ];

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

  // Fetch Predictions
  const { 
    execute: fetchPredictions, 
    loading: loadingPredictions, 
    error: errorPredictions, 
    value: predictionsRaw, // Renamed
    isNetworkError: isPredictionsNetworkError,
    isTimeoutError: isPredictionsTimeoutError,
    retry: retryPredictions, 
  } = useAsync<EsportsPrediction[]>(
    async () => {
      console.log('Fetching esports predictions');
      const response = await esportsService.getPredictions({ ...filters, status: 'pending' });
      console.log('Esports predictions received:', response.data);
      return response.data || []; // Return API data or empty array
    },
    {
      immediate: false, // Fetch triggered by useEffect
      onSuccess: () => { if (isMounted.current) setIsLoading(false); console.log('Predictions loaded successfully'); },
      onError: (err) => { if (isMounted.current) setIsLoading(false); console.error('Error in predictions hook:', err); },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );
  
  // Fetch Games
  const {
    execute: fetchGames,
    loading: loadingGames,
    error: errorGames,
    value: gamesRaw, // Renamed
    isNetworkError: isGamesNetworkError,
    isTimeoutError: isGamesTimeoutError,
    retry: retryGames,
  } = useAsync<string[]>(
    async () => {
      console.log('Fetching esports games');
      const response = await esportsService.getGames();
      console.log('Esports games received:', response.data);
      return response.data || []; // Return API data or empty array
    },
    { 
      immediate: false, // Fetch triggered by useEffect
      onSuccess: () => { if (isMounted.current) setIsLoading(false); console.log('Games loaded successfully'); },
      onError: (err) => { if (isMounted.current) setIsLoading(false); console.error('Error in games hook:', err); },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );
  
  // Fetch Tournaments (conditionally)
  const {
    execute: fetchTournaments,
    loading: loadingTournaments,
    error: errorTournaments,
    value: tournamentsRaw, // Renamed
    isNetworkError: isTournamentsNetworkError,
    isTimeoutError: isTournamentsTimeoutError,
    retry: retryTournaments,
  } = useAsync<string[]>(
    async (game: string) => {
      if (!game) return []; // Don't fetch if no game is selected
      console.log('Fetching tournaments for game:', game);
      const response = await esportsService.getTournaments(game);
      console.log('Tournaments received:', response.data);
      return response.data || []; // Return API data or empty array
    },
    { 
      immediate: false, // Fetch triggered by useEffect or game selection
      onSuccess: () => { if (isMounted.current) setIsLoading(false); console.log('Tournaments loaded successfully'); },
      onError: (err) => { if (isMounted.current) setIsLoading(false); console.error('Error in tournaments hook:', err); },
      maxRetries: 2,
      retryDelayMs: 2000
    }
  );

  // Combined loading, error, and retry logic
  const loading = activeTab === 'predictions' ? loadingPredictions :
                  activeTab === 'games' ? loadingGames :
                  (activeTab === 'tournaments' && selectedGame ? loadingTournaments : loadingGames); // Load games if no game selected for tournaments
  
  const currentError = activeTab === 'predictions' ? errorPredictions : 
                      activeTab === 'games' ? errorGames : 
                      (activeTab === 'tournaments' && selectedGame ? errorTournaments : errorGames);
  
  const isNetworkError = activeTab === 'predictions' ? isPredictionsNetworkError : 
                          activeTab === 'games' ? isGamesNetworkError : 
                          (activeTab === 'tournaments' && selectedGame ? isTournamentsNetworkError : isGamesNetworkError);
  
  const isTimeoutError = activeTab === 'predictions' ? isPredictionsTimeoutError : 
                          activeTab === 'games' ? isGamesTimeoutError : 
                          (activeTab === 'tournaments' && selectedGame ? isTournamentsTimeoutError : isGamesTimeoutError);
                 
  const retryFunction = () => {
    if (activeTab === 'predictions') {
      retryPredictions();
    } else if (activeTab === 'games') {
      retryGames();
    } else if (activeTab === 'tournaments') {
      if (selectedGame) {
        retryTournaments(); // Retry the last fetchTournaments call
      } else {
        retryGames(); // Retry fetching games if no game was selected
      }
    }
  };

  // Fetch data based on active tab and selected game
  useEffect(() => {
    if (isMounted.current) {
      setIsLoading(true);
      
      const safetyTimeout = setTimeout(() => {
        if (isMounted.current) setIsLoading(false);
      }, 10000); // Increased safety timeout
      
      const fetchData = async () => {
        try {
          if (activeTab === 'predictions') {
            await fetchPredictions();
          } else if (activeTab === 'games') {
            await fetchGames();
          } else if (activeTab === 'tournaments') {
            // Fetch games first if none are selected, otherwise fetch tournaments for the selected game
            if (!selectedGame) {
              await fetchGames(); 
            } else {
              await fetchTournaments(selectedGame);
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${activeTab}:`, error);
        } finally {
          clearTimeout(safetyTimeout);
          if (isMounted.current) setIsLoading(false);
        }
      };
      
      fetchData();
      
      return () => {
        clearTimeout(safetyTimeout);
        // No need to call setIsLoading(false) here as it's handled in finally and unmount effect
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters, selectedGame]); // Removed fetch functions from deps, they are stable refs

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
    switch (activeTab) {
      case 'predictions':
        // Use hardcoded data if API data is empty
        const predictions = (predictionsRaw && predictionsRaw.length > 0) ? predictionsRaw : hardcodedPredictions;
        console.log('Rendering esports predictions:', predictions);
        
        return (
          <motion.div 
            className="predictions-container" 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Esports Match Predictions</motion.h2>
            
            {predictions.length > 0 ? (
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
                <p>Check back soon for new predictions.</p>
              </div>
            )}
          </motion.div>
        );
      case 'games':
        // Use hardcoded games if API data is empty
        const games = (gamesRaw && gamesRaw.length > 0) ? gamesRaw : hardcodedGames;
        console.log('Rendering esports games:', games);
        
        return (
          <motion.div 
            className="games-container"
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Esports Games</motion.h2>
            
            {games.length > 0 ? (
              <motion.div className="games-grid">
                {games.map((game, index) => (
                  <motion.div 
                    key={game} 
                    variants={fadeIn} 
                    custom={index + 1}
                    className={`game-card ${selectedGame === game ? 'selected' : ''}`}
                    onClick={() => handleGameSelectForTournaments(game)}
                  >
                    <h3>{game}</h3>
                    <p className="game-description">{getGameDescription(game)}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No games available</h3>
                <p>Check back soon for game data.</p>
              </div>
            )}
            
            {selectedGame && (
              <motion.div 
                className="tournaments-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3>Tournaments for {selectedGame}</h3>
                
                {tournamentsRaw && tournamentsRaw.length > 0 ? (
                  <div className="tournaments-list">
                    {tournamentsRaw.map((tournament, index) => (
                      <motion.div 
                        key={tournament} 
                        className="tournament-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                      >
                        <h4>{tournament}</h4>
                        <p>{getTournamentDescription(tournament)}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-tournaments">
                    <p>No tournaments found for {selectedGame}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      case 'tournaments':
        // Use hardcoded tournaments if API data is empty
        const tournamentsList = (tournamentsRaw && tournamentsRaw.length > 0) 
          ? tournamentsRaw 
          : hardcodedTournaments;
        console.log('Rendering tournaments list:', tournamentsList);
        
        return (
          <motion.div 
            className="tournaments-container-tab"
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
          >
            <motion.h2 variants={fadeIn} custom={0}>Esports Tournaments</motion.h2>
            
            {tournamentsList.length > 0 ? (
              <motion.div className="tournaments-grid">
                {tournamentsList.map((tournament, index) => (
                  <motion.div 
                    key={tournament} 
                    variants={fadeIn} 
                    custom={index + 1}
                    className="tournament-card-large"
                  >
                    <h3>{tournament}</h3>
                    <div className="tournament-details">
                      <p><strong>Date:</strong> {getTournamentDate(tournament)}</p>
                      <p><strong>Prize Pool:</strong> {getTournamentPrize(tournament)}</p>
                      <p><strong>Location:</strong> {getTournamentLocation(tournament)}</p>
                      <p>{getTournamentDescription(tournament)}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <FiInfo size={48} className="empty-state-icon" />
                <h3>No tournaments available</h3>
                <p>Check back soon for tournament data.</p>
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
          onClick={() => { setActiveTab('games'); setSelectedGame(null); }}
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
                  {(gamesRaw || []).map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                  {(!gamesRaw || gamesRaw.length === 0) && (
                    <>
                      <option value="league-of-legends">League of Legends</option>
                      <option value="dota-2">Dota 2</option>
                      <option value="cs2">CS2</option>
                      <option value="valorant">Valorant</option>
                    </>
                  )}
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
            <h3>{typeof selectedPrediction.team1 === 'string' ? selectedPrediction.team1 : selectedPrediction.team1?.name || 'Team 1'} vs. {typeof selectedPrediction.team2 === 'string' ? selectedPrediction.team2 : selectedPrediction.team2?.name || 'Team 2'}</h3>
            <p className="modal-event">{selectedPrediction.game}</p>
            <p className="modal-date">{new Date(selectedPrediction.date).toLocaleDateString()}</p>
            {selectedPrediction.mvp && <p className="modal-mvp">MVP: {selectedPrediction.mvp}</p>}
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