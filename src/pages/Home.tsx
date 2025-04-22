import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VideoBackground from '../components/common/VideoBackground';
import '../styles/Home.css';
import footballIcon from '../assets/images/football-icon.svg';
import ufcIcon from '../assets/images/ufc-icon.svg';
import f1Icon from '../assets/images/f1-icon.svg';
import esportsIcon from '../assets/images/esports-icon.svg';

// We'll use an online video URL or our fallback gradient animation
// In a real app, you would include a video file in your project or use a CDN
const onlineVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4";

const Home = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  const sportCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1, scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(187, 134, 252, 0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <VideoBackground videoSrc={onlineVideoUrl} overlayOpacity={0.7}>
      <div className="home-content">
        {/* ZEN Logo placed above the video with higher z-index */}
        <motion.div 
          className="zen-logo"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            delay: 0.3
          }}
          style={{ display: 'flex', justifyContent: 'center', width: '0%' }}
        >
          <span className="primary">Z</span>
          <span className="secondary">E</span>
          <span className="primary">N</span>
        </motion.div>

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants}>
            AI-Powered Sports Predictions
          </motion.h1>
          <motion.p variants={itemVariants}>
            Advanced machine learning algorithms analyzing vast datasets to forecast sports outcomes with unparalleled precision
          </motion.p>
          <motion.div
            className="cta-button"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgba(187, 134, 252, 0.5)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/ufc">Get Started</Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="sports-grid"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="sport-category"
            variants={sportCardVariants}
            whileHover="hover"
          >
            <Link to="/football">
              <motion.img 
                src={footballIcon} 
                alt="Football" 
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }} 
              />
              <h3>Football</h3>
            </Link>
          </motion.div>

          <motion.div 
            className="sport-category"
            variants={sportCardVariants}
            whileHover="hover"
          >
            <Link to="/ufc">
              <motion.img 
                src={ufcIcon} 
                alt="UFC/MMA" 
                whileHover={{ 
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.5 }
                }} 
              />
              <h3>UFC/MMA</h3>
            </Link>
          </motion.div>

          <motion.div 
            className="sport-category"
            variants={sportCardVariants}
            whileHover="hover"
          >
            <Link to="/formula1">
              <motion.img 
                src={f1Icon} 
                alt="Formula 1" 
                whileHover={{ 
                  rotate: [0, 360],
                  transition: { duration: 0.8 }
                }} 
              />
              <h3>Formula 1</h3>
            </Link>
          </motion.div>

          <motion.div 
            className="sport-category"
            variants={sportCardVariants}
            whileHover="hover"
          >
            <Link to="/esports">
              <motion.img 
                src={esportsIcon} 
                alt="Esports" 
                whileHover={{ 
                  y: [0, -10, 0],
                  transition: { duration: 0.5, times: [0, 0.5, 1] }
                }} 
              />
              <h3>Esports</h3>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </VideoBackground>
  );
};

export default Home;