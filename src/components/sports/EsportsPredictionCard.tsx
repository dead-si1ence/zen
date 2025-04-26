import React from 'react';
import { motion } from 'framer-motion';
import { EsportsPrediction } from '../../types/models';
import { FiCalendar, FiUsers, FiBarChart, FiPercent } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import './PredictionCard.css'; // Assuming a common CSS file for cards

interface EsportsPredictionCardProps {
  prediction: EsportsPrediction;
  onClick: (prediction: EsportsPrediction) => void;
}

const EsportsPredictionCard: React.FC<EsportsPredictionCardProps> = ({ prediction, onClick }) => {
  // Handle potentially missing or malformed data
  if (!prediction) {
    console.error('Missing prediction data');
    return null;
  }

  const { game, tournament, date, team1, team2, prediction: predDetails, status } = prediction;

  // Handle both string and Team object types
  const team1Name = typeof team1 === 'string' ? team1 : team1?.name || 'Team 1';
  const team2Name = typeof team2 === 'string' ? team2 : team2?.name || 'Team 2';
  const team1Image = typeof team1 === 'string' ? '/zen/placeholder-team.png' : team1?.image || '/zen/placeholder-team.png';
  const team2Image = typeof team2 === 'string' ? '/zen/placeholder-team.png' : team2?.image || '/zen/placeholder-team.png';
  const gameName = game || 'Unknown Game';
  const tournamentName = tournament || 'Unknown Tournament';
  
  // Ensure prediction details exist
  const winner = predDetails?.winner || team1Name;
  const confidence = predDetails?.confidence || 0.5;
  const score = predDetails?.score || 'N/A';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { 
      scale: 1.03,
      boxShadow: '0 10px 25px rgba(3, 169, 244, 0.2)', // Esports blue shadow
      transition: { duration: 0.3 }
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending': return <span className="status-badge pending">Pending</span>;
      case 'correct': return <span className="status-badge correct">Correct</span>;
      case 'incorrect': return <span className="status-badge incorrect">Incorrect</span>;
      default: return <span className="status-badge pending">Pending</span>;
    }
  };

  // Handle date formatting with error protection
  const formattedDate = date ? formatDate(date) : 'TBD';

  return (
    <motion.div
      className="prediction-card esports-card" // Add specific class
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick(prediction)}
    >
      <div className="card-header">
        <span className="game-tournament">{gameName} - {tournamentName}</span>
        {getStatusBadge()}
      </div>

      <div className="teams-container">
        <div className="team">
          <img src={team1Image} alt={team1Name} className="team-logo" />
          <span className="team-name">{team1Name}</span>
        </div>
        <span className="vs-separator">VS</span>
        <div className="team">
          <img src={team2Image} alt={team2Name} className="team-logo" />
          <span className="team-name">{team2Name}</span>
        </div>
      </div>

      <div className="prediction-info">
        <div className="info-item">
          <FiCalendar className="info-icon" />
          <span>{formattedDate}</span>
        </div>
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
          <span>Confidence: {Math.round(confidence * 100)}%</span>
          <div className="confidence-bar-bg">
            <motion.div 
              className="confidence-bar-fg esports-confidence"
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EsportsPredictionCard;
