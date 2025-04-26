import React from 'react';
import { motion } from 'framer-motion';
import { FootballPrediction } from '../../types/models';
import { FiCalendar, FiShield, FiBarChart, FiPercent } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import './PredictionCard.css'; // Assuming a common CSS file for cards

interface FootballPredictionCardProps {
  prediction: FootballPrediction;
  onClick: (prediction: FootballPrediction) => void;
}

const FootballPredictionCard: React.FC<FootballPredictionCardProps> = ({ prediction, onClick }) => {
  const { competition, date, homeTeam, awayTeam, prediction: predDetails, status } = prediction;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { 
      scale: 1.03,
      boxShadow: '0 10px 25px rgba(76, 175, 80, 0.2)', // Football green shadow
      transition: { duration: 0.3 }
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending': return <span className="status-badge pending">Pending</span>;
      case 'correct': return <span className="status-badge correct">Correct</span>;
      case 'incorrect': return <span className="status-badge incorrect">Incorrect</span>;
      default: return null;
    }
  };

  return (
    <motion.div
      className="prediction-card football-card" // Add specific class
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick(prediction)}
    >
      <div className="card-header">
        <span className="game-tournament">{competition}</span>
        {getStatusBadge()}
      </div>

      <div className="teams-container">
        <div className="team">
          <img src={homeTeam.image || '/zen/placeholder-team.png'} alt={homeTeam.name} className="team-logo" />
          <span className="team-name">{homeTeam.name} (H)</span>
        </div>
        <span className="vs-separator">VS</span>
        <div className="team">
          <img src={awayTeam.image || '/zen/placeholder-team.png'} alt={awayTeam.name} className="team-logo" />
          <span className="team-name">{awayTeam.name} (A)</span>
        </div>
      </div>

      <div className="prediction-info">
        <div className="info-item">
          <FiCalendar className="info-icon" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="info-item">
          <FiShield className="info-icon" />
          <span>Predicted Winner: <strong>{predDetails.winner}</strong></span>
        </div>
        {predDetails.score && (
          <div className="info-item">
            <FiBarChart className="info-icon" />
            <span>Predicted Score: {predDetails.score}</span>
          </div>
        )}
        <div className="info-item confidence">
          <FiPercent className="info-icon" />
          <span>Confidence: {(predDetails.confidence * 100).toFixed(0)}%</span>
          <div className="confidence-bar-bg">
            <motion.div 
              className="confidence-bar-fg football-confidence"
              initial={{ width: 0 }}
              animate={{ width: `${predDetails.confidence * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FootballPredictionCard;
