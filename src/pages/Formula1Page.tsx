import { motion } from 'framer-motion';
import f1Icon from '../assets/images/f1-icon.svg';
import '../styles/SportPage.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

const Formula1Page = () => {
  // Define team colors for reference
  const teamColors = {
    "Red Bull Racing": "#0600EF",
    "Ferrari": "#DC0000",
    "Mercedes": "#00D2BE",
    "McLaren": "#FF8700",
    "Aston Martin": "#006F62",
    "Alpine": "#0090FF",
    "Williams": "#005AFF",
    "AlphaTauri": "#2B4562",
    "Alfa Romeo": "#900000",
    "Haas F1 Team": "#FFFFFF"
  };

  return (
    <div className="sport-page formula1-page">
      <motion.div 
        className="sport-header"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.img 
          src={f1Icon} 
          alt="Formula 1" 
          className="sport-page-icon"
          variants={fadeIn}
          custom={0}
          initial={{ rotateY: 0, opacity: 0 }}
          animate={{ 
            rotateY: 720, 
            opacity: 1,
            transition: { 
              type: "spring", 
              stiffness: 60, 
              damping: 20,
              duration: 1.5
            }
          }}
          style={{
            willChange: "transform", // Optimizing for performance
            backfaceVisibility: "hidden" // Improving Firefox rendering
          }}
        />
        <motion.h1 variants={fadeIn} custom={1}>Formula 1 Predictions</motion.h1>
        <motion.p variants={fadeIn} custom={2}>
          Advanced race simulations and performance forecasts for F1 teams and drivers
        </motion.p>
      </motion.div>

      <motion.section 
        className="api-sources"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
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
            style={{ willChange: "transform" }} // Performance optimization
          >
            <h3>Ergast Developer API</h3>
            <p>Historical F1 data from 1950 to the present, including results, standings, and schedules.</p>
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
            style={{ willChange: "transform" }} // Performance optimization
          >
            <h3>Formula One API</h3>
            <p>Real-time race data, telemetry, and team performance metrics from official Formula 1 sources.</p>
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
            style={{ willChange: "transform" }} // Performance optimization
          >
            <h3>Weather and Track Conditions</h3>
            <p>Environmental factors, track temperature, and weather predictions for each race location.</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="predictions-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 variants={fadeIn} custom={0}>Race Prediction</motion.h2>
        <motion.div 
          className="prediction-card"
          variants={fadeIn}
          custom={1}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(3, 218, 198, 0.15)'
          }}
          style={{ willChange: "transform" }} // Performance optimization
        >
          <div className="race-details">
            <div className="race-detail">
              <p className="detail-label">Race</p>
              <p className="detail-value">Monaco Grand Prix</p>
            </div>
            <div className="race-detail">
              <p className="detail-label">Date</p>
              <p className="detail-value">May 28, 2025</p>
            </div>
            <div className="race-detail">
              <p className="detail-label">Circuit</p>
              <p className="detail-value">Circuit de Monaco</p>
            </div>
            <div className="race-detail">
              <p className="detail-label">Length</p>
              <p className="detail-value">3.337 km</p>
            </div>
          </div>
          
          <div className="fighters">
            <div className="fighter fighter-1">
              <h3>Max Verstappen</h3>
              <p>Pole Position</p>
              <motion.span 
                className="win-chance"
                whileHover={{ scale: 1.1 }}
                style={{ willChange: "transform" }}
              >
                Win Chance: 62%
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
              style={{ backfaceVisibility: "hidden" }} // Firefox optimization
            >
              VS
            </motion.span>
            <div className="fighter fighter-2">
              <h3>Charles Leclerc</h3>
              <p>P2</p>
              <motion.span 
                className="win-chance"
                whileHover={{ scale: 1.1 }}
                style={{ willChange: "transform" }}
              >
                Win Chance: 28%
              </motion.span>
            </div>
          </div>
          
          <div className="prediction-details">
            <p className="event">Monaco Grand Prix • Race Day</p>
            <p className="prediction-summary">Expected winning margin: 3.2 seconds</p>
          </div>
          
          <motion.div 
            className="team-standings" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h4>Current Constructors Standings</h4>
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { pos: 1, team: "Red Bull Racing", points: 256 },
                  { pos: 2, team: "Ferrari", points: 212 },
                  { pos: 3, team: "Mercedes", points: 194 },
                  { pos: 4, team: "McLaren", points: 156 },
                  { pos: 5, team: "Aston Martin", points: 87 }
                ].map((team) => (
                  <motion.tr 
                    key={team.pos}
                    variants={fadeIn} 
                    custom={team.pos}
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)"
                    }}
                  >
                    <td>{team.pos}</td>
                    <td className="team-name">
                      <motion.span 
                        className="team-color" 
                        style={{ 
                          backgroundColor: teamColors[team.team as keyof typeof teamColors],
                          boxShadow: `0 0 10px ${teamColors[team.team as keyof typeof teamColors]}80`
                        }}
                      />
                      {team.team}
                    </td>
                    <td>{team.points}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </motion.section>
      
      <motion.div 
        className="floating-particles"
        initial="hidden"
        animate="visible"
      >
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.1,
              backgroundColor: index % 2 ? 'var(--primary-accent)' : 'var(--secondary-accent)'
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 8 + 12,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }
            }}
            style={{ willChange: "transform" }} // Performance optimization
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Formula1Page;