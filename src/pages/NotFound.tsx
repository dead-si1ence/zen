import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';
import VideoBackground from '../components/common/VideoBackground';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="digital-background"></div>

      {/* Use proper fallback gradient instead of empty video source */}
      <VideoBackground 
        videoSrc={''} 
        fallbackImageSrc="/zen/digital-background.jpg" 
        overlayOpacity={0.7}
        blurAmount={2}
      />

      <motion.div 
        className="not-found-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="error-code">404</div>
        <div className="glitch-container">
          <h1 className="glitch" data-text="Page Not Found">Page Not Found</h1>
        </div>
        <p>
          The page you're looking for doesn't exist or has been moved.
          It seems you've ventured into the void of the ZEN universe.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="home-button">
            <span>Return to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;