import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Modals.css';

// Use the environment variable for the base API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
          <img src={selectedTeam.crest} alt={`${selectedTeam.name} crest`} className="team-crest-large" />
          <h3>{selectedTeam.name}</h3>
          {teamDetails.founded && <p className="founded-year">Founded in {teamDetails.founded}</p>}
        </div>

        <div className="modal-cards-container">
            <div className="modal-card">
                {teamDetails.venue && <div className="detail-item"><strong>Stadium</strong> {teamDetails.venue}</div>}
                {teamDetails.website && <div className="detail-item website"><a href={teamDetails.website} target="_blank" rel="noopener noreferrer">Official Website</a></div>}
            </div>
            <div className="modal-card">
                {/* Safely access coach name */}
                {teamDetails.coach?.name && (<div className="detail-item"><strong>Coach</strong> {teamDetails.coach.name}</div>)}
                {/* Safely access running competitions */}
                {teamDetails.runningCompetitions?.length > 0 && (
                    <div className="detail-item">
                      <strong>Active Competitions</strong>
                      <ul className="competitions-list">
                        {teamDetails.runningCompetitions.map(c => <li key={c.id}>{c.name}</li>)}
                      </ul>
                    </div>
                )}
            </div>
        </div>
        
        <h4 className="squad-header">Squad</h4>
        <ul className="squad-list">{teamDetails.squad.map(p => <li key={p.id} className="squad-member"><span className="player-name">{p.name}</span><span className="player-position">{p.position}</span></li>)}</ul>
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

