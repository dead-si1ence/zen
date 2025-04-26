import React from 'react';
import { motion } from 'framer-motion';
import { FootballPrediction } from '../../types/models';
import { FiCalendar, FiBarChart, FiPercent, FiUsers } from 'react-icons/fi';
import './PredictionCard.css';

interface FootballPredictionCardProps {
  prediction: FootballPrediction;
  onClick: (prediction: FootballPrediction) => void;
}

const FootballPredictionCard: React.FC<FootballPredictionCardProps> = (props) => {
  // Handle potentially missing or malformed data
  if (!props.prediction) {
    console.error('Missing prediction data');
    return null;
  }

  const { prediction, onClick } = props;
  const { date, homeTeam, awayTeam, competition } = prediction;

  // Handle both string and Team object types
  const homeTeamName = typeof homeTeam === 'string' ? homeTeam : homeTeam?.name || 'Home Team';
  const awayTeamName = typeof awayTeam === 'string' ? awayTeam : awayTeam?.name || 'Away Team';
  const homeTeamImage = typeof homeTeam === 'string' ? '/zen/placeholder-team.png' : homeTeam?.image || '/zen/placeholder-team.png';
  const awayTeamImage = typeof awayTeam === 'string' ? '/zen/placeholder-team.png' : awayTeam?.image || '/zen/placeholder-team.png';
  
  // Get prediction details with fallbacks
  const winner = prediction.winner || 'TBD';
  const confidence = prediction.confidence || 50;
  const score = prediction.score || 'TBD';
  
  // Format date
  const matchDate = date ? new Date(date).toLocaleDateString() : 'TBD';

  return (
    <motion.div 
      className="prediction-card football-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0, 118, 255, 0.2)' }}
      onClick={() => onClick(prediction)}
    >
      <div className="card-header football">
        <span className="match-date">
          <FiCalendar className="header-icon" />
          {matchDate}
        </span>
        <span className="competition">{competition || 'Football Match'}</span>
      </div>

      <div className="teams-container">
        <div className="team">
          <img src={homeTeamImage} alt={homeTeamName} className="team-logo" />
          <span className="team-name">{homeTeamName} (H)</span>
        </div>
        <span className="vs-separator">VS</span>
        <div className="team">
          <img src={awayTeamImage} alt={awayTeamName} className="team-logo" />
          <span className="team-name">{awayTeamName} (A)</span>
        </div>
      </div>

      <div className="prediction-details">
        <div className="info-item">
          <FiUsers className="info-icon" />
          <span>Predicted Winner: <strong>{winner}</strong></span>
        </div>
        {score && (
          <div className="info-item">
            <FiBarChart className="info-icon" />
            <span>Predicted Score: {score}</span>
          </div>
        )}
        <div className="info-item confidence">
          <FiPercent className="info-icon" />
          <span>Confidence: {confidence}%</span>
          <div className="confidence-bar-bg">
            <motion.div 
              className="confidence-bar-fg football-confidence"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FootballPredictionCard;
