import { motion } from 'framer-motion';
import ufcIcon from '../assets/images/ufc-icon.svg';
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

const UFCPage = () => {
  return (
    <div className="sport-page">
      <motion.div 
        className="sport-header"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.img 
          src={ufcIcon} 
          alt="UFC" 
          className="sport-page-icon"
          variants={fadeIn}
          custom={0}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.h1 variants={fadeIn} custom={1}>UFC / MMA Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          AI-driven fight outcome predictions based on comprehensive fighter data
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
            <h3>SportsDataIO MMA API</h3>
            <p>Real-time coverage of every MMA fight, including scores, stats, odds, projections, and news.</p>
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
            <h3>Sportradar MMA API</h3>
            <p>Schedules and live results for all UFC events, including Dana White's Contender Series, with additional stats like win probabilities and competitor profiles.</p>
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
            <h3>Fighting Tomatoes API</h3>
            <p>Data about past UFC fights, including event details and outcomes for comprehensive historical analysis.</p>
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
        <motion.h2 variants={fadeIn} custom={0}>Upcoming Fight Predictions</motion.h2>
        <div className="prediction-cards">
          <motion.div 
            className="prediction-card"
            variants={fadeIn}
            custom={1}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
            }}
          >
            <div className="fighters">
              <div className="fighter fighter-1">
                <h3>Fighter A</h3>
                <p>Record: 21-3-0</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 68%
                </motion.span>
              </div>
              <motion.span 
                className="versus"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8], 
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                VS
              </motion.span>
              <div className="fighter fighter-2">
                <h3>Fighter B</h3>
                <p>Record: 18-5-1</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 32%
                </motion.span>
              </div>
            </div>
            <div className="prediction-details">
              <p className="event">UFC Fight Night • April 27, 2025</p>
              <p className="prediction-summary">Our AI predicts a win for Fighter A by submission in round 3</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="prediction-card"
            variants={fadeIn}
            custom={2}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
            }}
          >
            <div className="fighters">
              <div className="fighter fighter-1">
                <h3>Fighter C</h3>
                <p>Record: 25-2-0</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 51%
                </motion.span>
              </div>
              <motion.span 
                className="versus"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8], 
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                VS
              </motion.span>
              <div className="fighter fighter-2">
                <h3>Fighter D</h3>
                <p>Record: 23-1-0</p>
                <motion.span 
                  className="win-chance"
                  whileHover={{ scale: 1.1 }}
                >
                  Win Chance: 49%
                </motion.span>
              </div>
            </div>
            <div className="prediction-details">
              <p className="event">UFC 319 • May 3, 2025</p>
              <p className="prediction-summary">Our AI predicts a close fight with Fighter C winning by decision</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.div 
        className="floating-particles"
        initial="hidden"
        animate="visible"
      >
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default UFCPage;