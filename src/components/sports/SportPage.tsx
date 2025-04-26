import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SportType } from '../../types/models';
import '../../styles/SportPage.css';

interface SportPageProps {
  title: string;
  sportType: SportType;
  fallbackImageSrc?: string;
  children: ReactNode;
  themeColor?: string;
}

const SportPage = ({
  title,
  sportType,
  fallbackImageSrc,
  children,
  themeColor
}: SportPageProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Dynamic styles based on sport type
  const getSportClass = () => {
    switch (sportType) {
      case 'ufc':
        return 'sport-page-ufc';
      case 'formula1':
        return 'sport-page-f1';
      case 'football':
        return 'sport-page-football';
      case 'esports':
        return 'sport-page-esports';
      default:
        return '';
    }
  };
  
  const headerStyle = {
    ...(themeColor ? { backgroundColor: themeColor } : {}),
    ...(fallbackImageSrc ? { 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${fallbackImageSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {})
  };

  return (
    <div className={`sport-page ${getSportClass()}`}>
      <div className="sport-page-header" style={headerStyle}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h1>
      </div>

      <motion.div
        className="sport-page-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="sport-content-container"
          variants={itemVariants}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SportPage;