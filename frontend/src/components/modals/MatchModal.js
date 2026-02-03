import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { formatMatchDate, formatMatchStatus } from '../../utils/formatters';
import './Modals.css';

// Use the environment variable for the base API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

    return (
      <>
        <div className="match-modal-header">
          <div className="match-modal-team">
            <img src={selectedMatch.homeTeam.crest} alt={selectedMatch.homeTeam.name} className="team-crest-large"/>
            <h3>{selectedMatch.homeTeam.name}</h3>
          </div>
          <div className="match-modal-score">
            {selectedMatch.score.fullTime.home ?? '-'} : {selectedMatch.score.fullTime.away ?? '-'}
          </div>
          <div className="match-modal-team">
            <img src={selectedMatch.awayTeam.crest} alt={selectedMatch.awayTeam.name} className="team-crest-large"/>
            <h3>{selectedMatch.awayTeam.name}</h3>
          </div>
        </div>
        <div className="match-modal-details">
          <p>{formatMatchDate(selectedMatch.utcDate)}</p>
          {/* Correctly display venue and status from the fetched details */}
          <p><strong>Venue:</strong> {matchData.venue || 'Not available'}</p>
          <p><strong>Status:</strong> {formatMatchStatus(matchData.status)}</p>
        </div>
        {h2hData && (
          <div className="head-to-head-container">
            <h4>Head to Head</h4>
            <div className="h2h-stats">
              <div className="h2h-stat">
                <p>{selectedMatch.homeTeam.name} Wins</p>
                <p className="stat-number">{h2hData.homeTeam.wins}</p>
              </div>
              <div className="h2h-stat">
                <p>Draws</p>
                <p className="stat-number">{h2hData.homeTeam.draws}</p>
              </div>
              <div className="h2h-stat">
                <p>{selectedMatch.awayTeam.name} Wins</p>
                <p className="stat-number">{h2hData.awayTeam?.wins || h2hData.homeTeam.losses}</p>
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

