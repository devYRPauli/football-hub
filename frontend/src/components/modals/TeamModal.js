import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Modals.css';

// Use the environment variable for the base API URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Placeholder image for missing team crests
const PLACEHOLDER_CREST = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Ccircle cx="12" cy="12" r="10" stroke-width="2"/%3E%3Cpath d="M12 6v6l4 2" stroke-width="2"/%3E%3C/svg%3E';

function TeamModal({ team: selectedTeam, onClose }) {
  const [teamDetails, setTeamDetails] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchTeamDetails = async () => {
      setTeamLoading(true);
      try {
        // Use the new API_BASE_URL variable in the request
        const res = await axios.get(`${API_BASE_URL}/api/team/${selectedTeam.id}`);
        setTeamDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch team details", err);
        setTeamDetails(null);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchTeamDetails();
  }, [selectedTeam]);
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const getPositionBadgeClass = (position) => {
    if (!position) return 'position-badge';
    if (position.includes('Goalkeeper')) return 'position-badge goalkeeper';
    if (position.includes('Defence')) return 'position-badge defender';
    if (position.includes('Midfield')) return 'position-badge midfielder';
    if (position.includes('Offence') || position.includes('Attack')) return 'position-badge attacker';
    return 'position-badge';
  };

  const renderModalContent = () => {
    if (teamLoading) {
      return <p className="loading-message">Loading details...</p>;
    }
    if (!teamDetails) {
      return <p className="error-message">Could not load team details.</p>;
    }

    return (
      <>
        <div className="modal-header">
          <img src={selectedTeam.crest || PLACEHOLDER_CREST} alt={`${selectedTeam.name} crest`} className="team-crest-large" />
          <h3>{selectedTeam.name}</h3>
          {teamDetails.founded && <p className="founded-year">Founded in {teamDetails.founded}</p>}
        </div>

        <div className="modal-cards-container">
            <div className="modal-card">
                {teamDetails.venue && (
                  <div className="detail-item">
                    <div className="detail-content">
                      <strong>Stadium</strong>
                      <span>{teamDetails.venue}</span>
                    </div>
                  </div>
                )}
                {teamDetails.website && (
                  <div className="detail-item website">
                    <div className="detail-content">
                      <strong>Website</strong>
                      <a href={teamDetails.website} target="_blank" rel="noopener noreferrer">Visit Official Site</a>
                    </div>
                  </div>
                )}
            </div>
            <div className="modal-card">
                {teamDetails.coach?.name && (
                  <div className="detail-item">
                    <div className="detail-content">
                      <strong>Coach</strong>
                      <span>{teamDetails.coach.name}</span>
                    </div>
                  </div>
                )}
                {teamDetails.runningCompetitions?.length > 0 && (
                    <div className="detail-item">
                      <div className="detail-content">
                        <strong>Active Competitions</strong>
                        <ul className="competitions-list">
                          {teamDetails.runningCompetitions.map(c => <li key={c.id}>{c.name}</li>)}
                        </ul>
                      </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="squad-section">
          <h4 className="squad-header">
            Squad ({teamDetails.squad?.length || 0})
          </h4>
          <ul className="squad-list">
            {teamDetails.squad && teamDetails.squad.length > 0 ? (
              teamDetails.squad.map(p => (
                <li key={p.id} className="squad-member">
                  <span className="player-info">
                    <span className="player-name">{p.name}</span>
                    {p.nationality && <span className="player-nationality">{p.nationality}</span>}
                  </span>
                  <span className={getPositionBadgeClass(p.position)}>
                    {p.position || 'N/A'}
                  </span>
                </li>
              ))
            ) : (
              <li className="no-data">No squad information available</li>
            )}
          </ul>
        </div>
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

export default TeamModal;

