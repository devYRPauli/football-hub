import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { formatMatchDate, formatMatchStatus, getStatusIcon } from '../../utils/formatters';
import './Modals.css';

// Use the environment variable for the base API URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Placeholder image for missing team crests
const PLACEHOLDER_CREST = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Ccircle cx="12" cy="12" r="10" stroke-width="2"/%3E%3Cpath d="M12 6v6l4 2" stroke-width="2"/%3E%3C/svg%3E';

function MatchModal({ match: selectedMatch, onClose }) {
  const [matchDetails, setMatchDetails] = useState(null);
  const [matchLoading, setMatchLoading] = useState(true);

  useEffect(() => {
    if (!selectedMatch) return;
    
    const fetchMatchDetails = async () => {
      setMatchLoading(true);
      try {
        // Use the new API_BASE_URL variable in the request
        const res = await axios.get(`${API_BASE_URL}/api/match/${selectedMatch.id}`);
        setMatchDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch match details", err);
        setMatchDetails(null); 
      } finally {
        setMatchLoading(false);
      }
    };

    fetchMatchDetails();
  }, [selectedMatch]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const renderModalContent = () => {
    if (matchLoading) {
      return <p className="loading-message">Loading match details...</p>;
    }
    if (!matchDetails) {
      return <p className="error-message">Could not load match details.</p>;
    }

    // Correctly access the detailed match data
    const matchData = matchDetails.match || {};
    const h2hData = matchDetails.head2head;
    const status = matchData.status || selectedMatch.status;
    const homeScore = selectedMatch.score.fullTime.home ?? '-';
    const awayScore = selectedMatch.score.fullTime.away ?? '-';

    // Calculate H2H percentages for visualization
    const totalMatches = h2hData ? (h2hData.homeTeam.wins + h2hData.homeTeam.draws + (h2hData.awayTeam?.wins || h2hData.homeTeam.losses)) : 0;
    const homeWinPercentage = totalMatches > 0 ? (h2hData.homeTeam.wins / totalMatches) * 100 : 0;
    const drawPercentage = totalMatches > 0 ? (h2hData.homeTeam.draws / totalMatches) * 100 : 0;
    const awayWinPercentage = totalMatches > 0 ? ((h2hData.awayTeam?.wins || h2hData.homeTeam.losses) / totalMatches) * 100 : 0;

    return (
      <>
        <div className="match-modal-header">
          <div className="match-modal-team">
            <img src={selectedMatch.homeTeam.crest || PLACEHOLDER_CREST} alt={selectedMatch.homeTeam.name} className="team-crest-large"/>
            <h3>{selectedMatch.homeTeam.name}</h3>
          </div>
          <div className="match-modal-score-container">
            <div className="match-modal-score">
              <span className={homeScore > awayScore && homeScore !== '-' ? 'winning' : ''}>{homeScore}</span>
              <span className="score-separator">:</span>
              <span className={awayScore > homeScore && awayScore !== '-' ? 'winning' : ''}>{awayScore}</span>
            </div>
          </div>
          <div className="match-modal-team">
            <img src={selectedMatch.awayTeam.crest || PLACEHOLDER_CREST} alt={selectedMatch.awayTeam.name} className="team-crest-large"/>
            <h3>{selectedMatch.awayTeam.name}</h3>
          </div>
        </div>
        
        <div className="match-modal-info">
          <div className="info-item">
            <div className="info-content">
              <strong>Date & Time</strong>
              <span>{formatMatchDate(selectedMatch.utcDate)}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-content">
              <strong>Status</strong>
              <span className={`match-status-badge ${status.toLowerCase()}`}>
                {formatMatchStatus(status)}
              </span>
            </div>
          </div>
          {matchData.venue && (
            <div className="info-item">
              <div className="info-content">
                <strong>Venue</strong>
                <span>{matchData.venue}</span>
              </div>
            </div>
          )}
          {matchData.competition?.name && (
            <div className="info-item">
              <div className="info-content">
                <strong>Competition</strong>
                <span>{matchData.competition.name}</span>
              </div>
            </div>
          )}
        </div>

        {h2hData && totalMatches > 0 && (
          <div className="head-to-head-container">
            <h4 className="h2h-title">
              Head to Head
              <span className="h2h-total">({totalMatches} matches)</span>
            </h4>
            
            {/* Visual H2H Bar */}
            <div className="h2h-visual-bar">
              <div className="h2h-bar-segment home" style={{width: `${homeWinPercentage}%`}} title={`${h2hData.homeTeam.wins} wins`}></div>
              <div className="h2h-bar-segment draw" style={{width: `${drawPercentage}%`}} title={`${h2hData.homeTeam.draws} draws`}></div>
              <div className="h2h-bar-segment away" style={{width: `${awayWinPercentage}%`}} title={`${h2hData.awayTeam?.wins || h2hData.homeTeam.losses} wins`}></div>
            </div>

            <div className="h2h-stats">
              <div className="h2h-stat home-stat">
                <p className="stat-label">{selectedMatch.homeTeam.name}</p>
                <p className="stat-number">{h2hData.homeTeam.wins}</p>
                <p className="stat-sublabel">Wins</p>
              </div>
              <div className="h2h-stat draw-stat">
                <p className="stat-label">Draws</p>
                <p className="stat-number">{h2hData.homeTeam.draws}</p>
                <p className="stat-sublabel">Matches</p>
              </div>
              <div className="h2h-stat away-stat">
                <p className="stat-label">{selectedMatch.awayTeam.name}</p>
                <p className="stat-number">{h2hData.awayTeam?.wins || h2hData.homeTeam.losses}</p>
                <p className="stat-sublabel">Wins</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <motion.div className="modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-content" onClick={(e) => e.stopPropagation()} variants={modalVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {renderModalContent()}
      </motion.div>
    </motion.div>
  );
}

export default MatchModal;

