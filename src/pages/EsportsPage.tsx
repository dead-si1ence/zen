import { motion } from 'framer-motion';
import esportsIcon from '../assets/images/esports-icon.svg';
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

// Keyboard typing animation for the esports theme
const typingContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const typingCharacter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 200 }
  }
};

const EsportsPage = () => {
  const title = "Esports Predictions";
  
  return (
    <div className="sport-page esports-page">
      <motion.div 
        className="sport-header"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.img 
          src={esportsIcon} 
          alt="Esports" 
          className="sport-page-icon"
          variants={fadeIn}
          custom={0}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: [0.5, 1.2, 1],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 1.5 }}
        />
        
        <motion.h1 variants={typingContainer} initial="hidden" animate="visible" className="typing-text">
          {title.split('').map((char, index) => (
            <motion.span key={`title-${index}`} variants={typingCharacter}>
              {char}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.p variants={fadeIn} custom={2}>
          AI-driven match outcome predictions for major esports titles
        </motion.p>
      </motion.div>

      <motion.section 
        className="api-sources"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 
          variants={fadeIn} 
          custom={0}
          className="glow-text"
        >
          Our Data Sources
        </motion.h2>
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
            <h3>PandaScore API</h3>
            <p>Provides reliable and extensive statistics and odds for esports titles like LoL, CS2, and Dota 2, with in-play statistics and odds.</p>
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
            <h3>Abios Esports API</h3>
            <p>Offers access to a large esports database with in-depth statistics, live scores, and more, covering over 15 games.</p>
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
            <h3>GameScorekeeper API</h3>
            <p>Connects to various data sources to track the entire ecosystem of esports, including tournaments, matches, teams, and individual players.</p>
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
        <motion.h2 
          variants={fadeIn} 
          custom={0}
          className="glow-text"
        >
          Upcoming Match Predictions
        </motion.h2>
        <div className="prediction-cards">
          <motion.div 
            className="prediction-card esports-card"
            variants={fadeIn}
            custom={1}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
            }}
          >
            <div className="esports-card-header">
              <motion.span 
                className="game-badge"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                CS2
              </motion.span>
            </div>

            <div className="fighters">
              <div className="fighter fighter-1">
                <h3>Team Alpha</h3>
                <p>League: CS2</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(187, 134, 252, 0.2)', '0 0 15px rgba(187, 134, 252, 0.6)', '0 0 0 rgba(187, 134, 252, 0.2)'],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  Win Chance: 59%
                </motion.span>
              </div>
              
              <motion.span 
                className="versus"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8], 
                  opacity: [0.5, 1, 0.5],
                  rotateY: [0, 180, 360],
                  transition: { duration: 5, repeat: Infinity }
                }}
              >
                VS
              </motion.span>
              
              <div className="fighter fighter-2">
                <h3>Team Beta</h3>
                <p>League: CS2</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(3, 218, 198, 0.2)', '0 0 15px rgba(3, 218, 198, 0.6)', '0 0 0 rgba(3, 218, 198, 0.2)'],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  Win Chance: 41%
                </motion.span>
              </div>
            </div>
            
            <div className="prediction-details esports-details">
              <p className="event">ESL Pro League Season 24 • April 28, 2025</p>
              <p className="prediction-summary">Our AI predicts Team Alpha to win 2-1 in a close best-of-three series</p>
              <motion.div 
                className="digital-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              ></motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="prediction-card esports-card"
            variants={fadeIn}
            custom={2}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
            }}
          >
            <div className="esports-card-header">
              <motion.span 
                className="game-badge lol"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                LoL
              </motion.span>
            </div>

            <div className="fighters">
              <div className="fighter fighter-1">
                <h3>Team Dragon</h3>
                <p>League: LoL</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(187, 134, 252, 0.2)', '0 0 15px rgba(187, 134, 252, 0.6)', '0 0 0 rgba(187, 134, 252, 0.2)'],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  Win Chance: 72%
                </motion.span>
              </div>
              
              <motion.span 
                className="versus"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8], 
                  opacity: [0.5, 1, 0.5],
                  rotateY: [0, 180, 360],
                  transition: { duration: 5, repeat: Infinity }
                }}
              >
                VS
              </motion.span>
              
              <div className="fighter fighter-2">
                <h3>Team Phoenix</h3>
                <p>League: LoL</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(3, 218, 198, 0.2)', '0 0 15px rgba(3, 218, 198, 0.6)', '0 0 0 rgba(3, 218, 198, 0.2)'],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  Win Chance: 28%
                </motion.span>
              </div>
            </div>
            
            <div className="prediction-details esports-details">
              <p className="event">LCS Spring Split • May 1, 2025</p>
              <p className="prediction-summary">Our AI predicts Team Dragon to win with superior objective control</p>
              <motion.div 
                className="digital-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.div 
        className="floating-particles"
        initial="hidden"
        animate="visible"
      >
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className="particle digital-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.2,
              opacity: Math.random() * 0.4 + 0.1,
              backgroundColor: index % 3 === 0 ? 'var(--primary-accent)' : 
                              index % 3 === 1 ? 'var(--secondary-accent)' : '#ffffff'
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [
                Math.random() * 0.4 + 0.1,
                Math.random() * 0.7 + 0.3,
                Math.random() * 0.4 + 0.1
              ],
              transition: {
                duration: Math.random() * 8 + 12,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </motion.div>
      
      <motion.div 
        className="digital-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
      ></motion.div>
    </div>
  );
};

export default EsportsPage;