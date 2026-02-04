import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEAGUE_NAMES } from '../constants';
import { containerVariants, itemVariants } from '../animations/variants';
import './Home.css';

import clLogo from '../assets/cl.svg';
import plLogo from '../assets/pl.svg';
import bl1Logo from '../assets/bl1.svg';
import saLogo from '../assets/sa.svg';
import pdLogo from '../assets/pd.svg';
import fl1Logo from '../assets/fl1.svg';
import pplLogo from '../assets/ppl.svg';

const leagueLogos = {
  CL: clLogo, PL: plLogo, BL1: bl1Logo, SA: saLogo,
  PD: pdLogo, FL1: fl1Logo, PPL: pplLogo,
};

const topRowLeagues = ['CL', 'PL', 'BL1', 'SA'];
const bottomRowLeagues = ['PD', 'FL1', 'PPL'];

function Home({ theme, toggleTheme }) {
  const navigate = useNavigate();

  const handleLeagueSelect = (leagueCode) => {
    navigate(`/league/${leagueCode}/standings`);
  };

  const handleKeyDown = (event, leagueCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLeagueSelect(leagueCode);
    }
  };

  const renderLeagueRow = (leagueCodes) => (
    <motion.div className="league-row" variants={containerVariants}>
      {leagueCodes.map(code => (
        <motion.div
          key={code}
          className="league-card"
          onClick={() => handleLeagueSelect(code)}
          onKeyDown={(e) => handleKeyDown(e, code)}
          role="button"
          tabIndex={0}
          aria-label={`View ${LEAGUE_NAMES[code]} standings and fixtures`}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-league-code={code}
          data-league-name={LEAGUE_NAMES[code]}
        >
          <img src={leagueLogos[code]} alt={`${LEAGUE_NAMES[code]} logo`} className="league-logo" />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="home-container">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="hero-title">Football Hub</h1>
        <p className="hero-subtitle">Your premium destination for live scores, standings, and fixtures from the world's top football leagues.</p>
      </motion.div>

      <motion.div 
        className="league-grid-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {renderLeagueRow(topRowLeagues)}
        {renderLeagueRow(bottomRowLeagues)}
      </motion.div>

      <div
        className="floating-theme-toggle"
        onClick={toggleTheme}
        data-theme={theme}
        aria-label="Toggle Theme"
      >
        <div className="theme-toggle-indicator"></div>
      </div>
    </div>
  );
}

export default Home;

