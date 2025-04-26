import { motion } from 'framer-motion';
import { useState } from 'react';
import { Formula1Prediction } from '../../types/models';
import { formatDate, formatConfidence } from '../../utils/helpers';

interface Formula1PredictionCardProps {
  prediction: Formula1Prediction;
  onClick?: (prediction: Formula1Prediction) => void;
}

const Formula1PredictionCard: React.FC<Formula1PredictionCardProps> = ({ prediction, onClick }) => {
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
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 0, 0, 0.3)',
      transition: { duration: 0.2 }
    },
    tap: { y: 0, scale: 0.98 }
  };
  
  // Card header background gradient based on confidence
  const headerGradient = () => {
    // Use optional chaining or nullish coalescing to safely access confidence
    const confidenceValue = prediction.confidence ?? 0;
    
    if (confidenceValue >= 75) {
      return 'linear-gradient(90deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0))';
    } else if (confidenceValue >= 45) {
      return 'linear-gradient(90deg, rgba(255, 153, 0, 0.15), rgba(255, 153, 0, 0))';
    }
    return 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))';
  };
  
  const handleCardClick = () => {
    if (onClick) onClick(prediction);
  };

  return (
    <motion.div 
      className="prediction-card f1-prediction-card"
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
        <h3>{prediction.grandPrix}</h3>
        <span className={`prediction-status ${prediction.status}`}>
          {prediction.status === 'pending' ? 'Upcoming' : prediction.status}
        </span>
      </div>
      
      <div className="prediction-card-content f1-race">
        <div className="race-info">
          <div className="race-track">
            <img 
              src={prediction.circuitImageUrl || '/zen/default-circuit.png'} 
              alt={`${prediction.circuit || 'Circuit'} layout`}
            />
            <span className="circuit-name">{prediction.circuit || 'TBA'}</span>
          </div>
          
          <div className="race-details">
            <p><strong>Date:</strong> {formatDate(prediction.raceDate || prediction.date)}</p>
            <p><strong>Location:</strong> {prediction.location || 'TBA'}</p>
            <p><strong>Circuit Length:</strong> {prediction.circuitLength || 'TBA'}km</p>
            <p><strong>Laps:</strong> {prediction.laps || 'TBA'}</p>
          </div>
        </div>
        
        {prediction.podium && (
          <div className="podium-predictions">
            <h4>Predicted Podium</h4>
            
            <div className="podium-positions">
              {/* Second Place - Left */}
              <div className="podium-position p2">
                <span className="position-number">2</span>
                <div className="driver-card">
                  <img 
                    src={prediction.podium[1]?.driver.image || '/zen/placeholder-driver.png'} 
                    alt={prediction.podium[1]?.driver.name} 
                    className="driver-image"
                  />
                  <span className="driver-name">{prediction.podium[1]?.driver.name}</span>
                  <span className="team-name">{prediction.podium[1]?.driver.team}</span>
                </div>
              </div>

              {/* First Place - Center */}
              <div className="podium-position p1">
                <span className="position-number">1</span>
                <div className="driver-card">
                  <img 
                    src={prediction.podium[0]?.driver.image || '/zen/placeholder-driver.png'} 
                    alt={prediction.podium[0]?.driver.name} 
                    className="driver-image"
                  />
                  <span className="driver-name">{prediction.podium[0]?.driver.name}</span>
                  <span className="team-name">{prediction.podium[0]?.driver.team}</span>
                </div>
              </div>

              {/* Third Place - Right */}
              <div className="podium-position p3">
                <span className="position-number">3</span>
                <div className="driver-card">
                  <img 
                    src={prediction.podium[2]?.driver.image || '/zen/placeholder-driver.png'} 
                    alt={prediction.podium[2]?.driver.name} 
                    className="driver-image"
                  />
                  <span className="driver-name">{prediction.podium[2]?.driver.name}</span>
                  <span className="team-name">{prediction.podium[2]?.driver.team}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <motion.div 
        className="f1-prediction-details"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4>Key Prediction Insights</h4>
        <ul>
          <li>Pole Position: {prediction.polePosition ? prediction.polePosition.name : 'TBA'}</li>
          <li>Fastest Lap: {prediction.fastestLap ? prediction.fastestLap.name : 'TBA'}</li>
          <li>Weather Impact: {prediction.weatherImpact || 'Unknown'}</li>
          <li>Safety Car: {prediction.safetyCar ? 'Yes' : 'No'}</li>
        </ul>
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

export default Formula1PredictionCard;