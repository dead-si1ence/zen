import { motion } from 'framer-motion';
import footballIcon from '../assets/images/football-icon.svg';
import '../styles/SportPage.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.2,
      duration: 0.8,
      ease: "easeOut"
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const bounceAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-3, 3, -3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const FootballPage = () => {
  return (
    <div className="sport-page football-page">
      <motion.div 
        className="sport-header"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.img 
          src={footballIcon} 
          alt="Football" 
          className="sport-page-icon"
          variants={fadeIn}
          custom={0}
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20 
          }}
        />
        <motion.h1 variants={fadeIn} custom={1}>Football Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          AI-driven match outcome predictions across global leagues
        </motion.p>
      </motion.div>

      <motion.section 
        className="api-sources"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeIn} custom={0}>Our Data Sources</motion.h2>
        <div className="api-cards">
          <motion.div 
            className="api-card"
            variants={fadeIn}
            custom={1}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 10px 25px rgba(187, 134, 252, 0.2)',
              backgroundColor: 'rgba(187, 134, 252, 0.07)'
            }}
          >
            <h3>API-Football</h3>
            <p>Covers over 1,100 leagues and cups with live scores, standings, events, line-ups, players, pre-match odds, and statistics.</p>
          </motion.div>
          <motion.div 
            className="api-card"
            variants={fadeIn}
            custom={2}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 10px 25px rgba(187, 134, 252, 0.2)',
              backgroundColor: 'rgba(187, 134, 252, 0.07)'
            }}
          >
            <h3>Sportmonks Football API</h3>
            <p>Provides live scores, lineups, odds, and stats across 2,500+ football leagues globally.</p>
          </motion.div>
          <motion.div 
            className="api-card"
            variants={fadeIn}
            custom={3}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 10px 25px rgba(187, 134, 252, 0.2)',
              backgroundColor: 'rgba(187, 134, 252, 0.07)'
            }}
          >
            <h3>Football-Data.org</h3>
            <p>Offers football data and statistics in a machine-readable format, including live scores, fixtures, tables, squads, and lineups.</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="predictions-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeIn} custom={0}>Upcoming Match Predictions</motion.h2>
        <div className="prediction-cards">
          <motion.div 
            className="prediction-card football-card"
            variants={fadeIn}
            custom={1}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
            }}
          >
            <motion.div className="league-badge" initial="initial" animate="animate" variants={bounceAnimation}>
              <span>Premier League</span>
            </motion.div>
            
            <div className="fighters">
              <div className="fighter fighter-1">
                <h3>Team United</h3>
                <p>Position: 2nd</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 48%
                </motion.span>
              </div>
              <motion.span 
                className="versus"
                animate={{ 
                  textShadow: [
                    '0 0 5px rgba(255, 255, 255, 0.5)',
                    '0 0 20px rgba(255, 255, 255, 0.5)',
                    '0 0 5px rgba(255, 255, 255, 0.5)'
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                VS
              </motion.span>
              <div className="fighter fighter-2">
                <h3>Team City</h3>
                <p>Position: 1st</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 32%
                </motion.span>
              </div>
            </div>

            <motion.div 
              className="match-stats"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="stat-item" variants={fadeIn} custom={4}>
                <span className="stat-label">Draw Probability:</span>
                <span className="stat-value">20%</span>
              </motion.div>
              <motion.div className="stat-item" variants={fadeIn} custom={5}>
                <span className="stat-label">Expected Goals:</span>
                <span className="stat-value">2.3 - 1.5</span>
              </motion.div>
              <motion.div className="stat-item" variants={fadeIn} custom={6}>
                <span className="stat-label">Form (Last 5):</span>
                <div className="form-indicators">
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-draw" whileHover={{ scale: 1.2 }}>D</motion.span>
                  <motion.span className="form-loss" whileHover={{ scale: 1.2 }}>L</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                </div>
                <div className="form-indicators opponent">
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-draw" whileHover={{ scale: 1.2 }}>D</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="prediction-details">
              <p className="event">Premier League • April 29, 2025 • 20:00 GMT</p>
              <p className="prediction-summary">Our AI predicts a 2-1 win for Team United</p>
            </div>
          </motion.div>

          <motion.div 
            className="prediction-card football-card"
            variants={fadeIn}
            custom={2}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
            }}
          >
            <motion.div className="league-badge laliga" initial="initial" animate="animate" variants={bounceAnimation}>
              <span>La Liga</span>
            </motion.div>
            
            <div className="fighters">
              <div className="fighter fighter-1">
                <h3>FC Barcelona</h3>
                <p>Position: 1st</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 65%
                </motion.span>
              </div>
              <motion.span 
                className="versus"
                animate={{ 
                  textShadow: [
                    '0 0 5px rgba(255, 255, 255, 0.5)',
                    '0 0 20px rgba(255, 255, 255, 0.5)',
                    '0 0 5px rgba(255, 255, 255, 0.5)'
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                VS
              </motion.span>
              <div className="fighter fighter-2">
                <h3>Real Madrid</h3>
                <p>Position: 2nd</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 22%
                </motion.span>
              </div>
            </div>

            <motion.div 
              className="match-stats"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="stat-item" variants={fadeIn} custom={4}>
                <span className="stat-label">Draw Probability:</span>
                <span className="stat-value">13%</span>
              </motion.div>
              <motion.div className="stat-item" variants={fadeIn} custom={5}>
                <span className="stat-label">Expected Goals:</span>
                <span className="stat-value">2.8 - 1.2</span>
              </motion.div>
              <motion.div className="stat-item" variants={fadeIn} custom={6}>
                <span className="stat-label">Form (Last 5):</span>
                <div className="form-indicators">
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-draw" whileHover={{ scale: 1.2 }}>D</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                </div>
                <div className="form-indicators opponent">
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-loss" whileHover={{ scale: 1.2 }}>L</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-win" whileHover={{ scale: 1.2 }}>W</motion.span>
                  <motion.span className="form-draw" whileHover={{ scale: 1.2 }}>D</motion.span>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="prediction-details">
              <p className="event">La Liga • May 3, 2025 • 19:45 CET</p>
              <p className="prediction-summary">Our AI predicts a 3-1 win for FC Barcelona</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.div 
        className="floating-particles"
        initial="hidden"
        animate="visible"
      >
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            className="particle football-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.1,
              opacity: Math.random() * 0.3 + 0.1,
              backgroundColor: index % 2 ? 'var(--primary-accent)' : 'var(--secondary-accent)'
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default FootballPage;