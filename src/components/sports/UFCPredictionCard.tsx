import { motion } from 'framer-motion';
import { useState } from 'react';
import { UFCPrediction } from '../../types/models';
import { formatDate, formatConfidence } from '../../utils/helpers';

interface UFCPredictionCardProps {
  prediction: UFCPrediction;
  onClick?: (prediction: UFCPrediction) => void;
}

const UFCPredictionCard: React.FC<UFCPredictionCardProps> = ({ prediction, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper to determine confidence class
  const getConfidenceClass = (confidence: number): string => {
    if (confidence >= 75) return 'high';
    if (confidence >= 45) return 'medium';
    return 'low';
  };

  // Card animation
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: -5,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(187, 134, 252, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { y: 0, scale: 0.98 }
  };
  
  // Card header background gradient based on confidence
  const headerGradient = () => {
    // Use optional chaining or nullish coalescing to safely access confidence
    const confidenceValue = prediction.confidence ?? 0;
    
    if (confidenceValue >= 75) {
      return 'linear-gradient(90deg, rgba(0, 200, 83, 0.15), rgba(0, 200, 83, 0))';
    } else if (confidenceValue >= 45) {
      return 'linear-gradient(90deg, rgba(255, 214, 0, 0.15), rgba(255, 214, 0, 0))';
    }
    return 'linear-gradient(90deg, rgba(207, 102, 121, 0.15), rgba(207, 102, 121, 0))';
  };
  
  const handleCardClick = () => {
    if (onClick) onClick(prediction);
  };

  // Get the predicted winner
  const predictedWinnerId = prediction.predictedWinner;

  return (
    <motion.div 
      className="prediction-card ufc-prediction-card"
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleCardClick();
      }}
    >
      <div className="prediction-card-header" style={{ background: headerGradient() }}>
        <h3>{prediction.event}</h3>
        <span className={`prediction-status ${prediction.status}`}>
          {prediction.status === 'pending' ? 'Upcoming' : prediction.status}
        </span>
      </div>
      
      <div className="prediction-card-content ufc-matchup">
        <div className="fighter fighter1">
          <div className="fighter-placeholder">{prediction.fighter1.name[0]}</div>
          <h4>{prediction.fighter1.name}</h4>
          <p className="fighter-record">{prediction.fighter1.record}</p>
        </div>
        
        <div className="vs-badge">VS</div>
        
        <div className="fighter fighter2">
          <div className="fighter-placeholder">{prediction.fighter2.name[0]}</div>
          <h4>{prediction.fighter2.name}</h4>
          <p className="fighter-record">{prediction.fighter2.record}</p>
        </div>
      </div>
      
      <motion.div 
        className="prediction-details"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <p><strong>Predicted Winner:</strong> {
          prediction.fighter1.id === predictedWinnerId 
            ? prediction.fighter1.name 
            : prediction.fighter2.name
        }</p>
        <p><strong>Method:</strong> {prediction.predictedMethod || 'Decision'}</p>
        {prediction.predictedRound && <p><strong>Round:</strong> {prediction.predictedRound}</p>}
        <p className="prediction-explanation">{prediction.explanation || 'No additional insights available.'}</p>
      </motion.div>
      
      <div className="prediction-card-footer">
        <span className={`confidence-badge ${getConfidenceClass(prediction.confidence || 0)}`}>
          Confidence: {formatConfidence(prediction.confidence || 0)}
        </span>
        <span className="prediction-date">{formatDate(prediction.timestamp || prediction.date)}</span>
      </div>
    </motion.div>
  );
};

export default UFCPredictionCard;