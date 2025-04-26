import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';
import '../styles/Home.css';

// Import assets
import footballIcon from '../assets/images/football-icon.svg';
import ufcIcon from '../assets/images/ufc-icon.svg';
import f1Icon from '../assets/images/f1-icon.svg';
import esportsIcon from '../assets/images/esports-icon.svg';

const Home = () => {
  const { setIsLoading } = useContext(AppContext);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Set default animation settings with reduced motion preference in mind
  const animationSettings = prefersReducedMotion ? { 
    type: "tween", 
    duration: 0.1 
  } : { 
    type: "spring", 
    stiffness: 100, 
    damping: 15 
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.1 : 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: animationSettings
    }
  };

  const sportCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1, scale: 1,
      transition: animationSettings
    },
    hover: {
      scale: prefersReducedMotion ? 1 : 1.05,
      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(187, 134, 252, 0.3)",
      transition: animationSettings
    }
  };
  
  // Simulate loading state for page transitions
  const handleNavigate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="home-container" style={{
      background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/zen/background-fallback.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <div className="home-content">
        {/* ZEN Logo with optimized positioning */}
        <motion.div 
          className="zen-logo"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            delay: 0.2
          }}
        >
          <h1 className="logo-text">
            <span className="logo-z" aria-hidden="true">Z</span>
            <span className="logo-e" aria-hidden="true">E</span>
            <span className="logo-n" aria-hidden="true">N</span>
            <span className="visually-hidden">ZEN - AI Sports Predictions</span>
          </h1>
          <div className="logo-glow"></div>
        </motion.div>

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="hero-title">
            AI-Powered Sports Predictions
          </motion.h2>
          <motion.p variants={itemVariants} className="hero-subtitle">
            Advanced machine learning analyzing vast datasets to forecast 
            sports outcomes with unparalleled precision
          </motion.p>
          <motion.div
            className="cta-button"
            variants={itemVariants}
            whileHover={!prefersReducedMotion ? { 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(187, 134, 252, 0.5)",
              transition: { duration: 0.2 }
            } : {}}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/ufc" onClick={handleNavigate} aria-label="Get Started with UFC predictions">
              Get Started
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className={`sports-grid ${isMobile ? 'mobile' : ''}`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <SportCard 
            to="/football"
            icon={footballIcon}
            alt="Football"
            title="Football"
            variants={sportCardVariants}
            animationType="bounce"
            prefersReducedMotion={prefersReducedMotion}
            onClick={handleNavigate}
          />

          <SportCard 
            to="/ufc"
            icon={ufcIcon}
            alt="UFC/MMA"
            title="UFC/MMA"
            variants={sportCardVariants}
            animationType="pulse"
            prefersReducedMotion={prefersReducedMotion}
            onClick={handleNavigate}
          />

          <SportCard 
            to="/formula1"
            icon={f1Icon}
            alt="Formula 1"
            title="Formula 1"
            variants={sportCardVariants}
            animationType="rotate"
            prefersReducedMotion={prefersReducedMotion}
            onClick={handleNavigate}
          />

          <SportCard 
            to="/esports"
            icon={esportsIcon}
            alt="Esports"
            title="Esports"
            variants={sportCardVariants}
            animationType="float"
            prefersReducedMotion={prefersReducedMotion}
            onClick={handleNavigate}
          />
        </motion.div>
        
        <motion.div 
          className="home-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p>Combining AI technology with sports analysis expertise</p>
        </motion.div>
      </div>
    </div>
  );
};

// SportCard component for consistent card rendering
interface SportCardProps {
  to: string;
  icon: string;
  alt: string;
  title: string;
  variants: any;
  animationType: 'bounce' | 'pulse' | 'rotate' | 'float';
  prefersReducedMotion: boolean;
  onClick: () => void;
}

const SportCard = ({ 
  to, icon, alt, title, variants, animationType, prefersReducedMotion, onClick 
}: SportCardProps) => {
  // Define different hover animations
  const getHoverAnimation = () => {
    if (prefersReducedMotion) return {};
    
    switch(animationType) {
      case 'bounce':
        return { 
          y: [0, -10, 0],
          transition: { duration: 0.5, times: [0, 0.5, 1], repeat: 0 }
        };
      case 'pulse':
        return { 
          scale: [1, 1.2, 1],
          transition: { duration: 0.5, times: [0, 0.5, 1], repeat: 0 }
        };
      case 'rotate':
        return { 
          rotate: [0, 360],
          transition: { duration: 0.8, repeat: 0 }
        };
      case 'float':
        return { 
          y: [0, -8, 0],
          transition: { duration: 0.6, times: [0, 0.5, 1], repeat: 0 }
        };
      default:
        return {};
    }
  };
  
  return (
    <motion.div 
      className="sport-category"
      variants={variants}
      whileHover="hover"
      tabIndex={0}
    >
      <Link to={to} onClick={onClick}>
        <div className="sport-icon-container">
          <motion.img 
            src={icon} 
            alt={alt} 
            whileHover={getHoverAnimation()}
            className="sport-icon"
          />
        </div>
        <h3>{title}</h3>
      </Link>
    </motion.div>
  );
};

export default Home;