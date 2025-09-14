import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEAGUE_NAMES } from '../constants';
import { containerVariants, itemVariants } from '../animations/variants';
import './Home.css';

import clLogo from '../assets/cl.png';
import plLogo from '../assets/pl.png';
import bl1Logo from '../assets/bl1.png';
import saLogo from '../assets/sa.png';
import pdLogo from '../assets/pd.png';
import fl1Logo from '../assets/fl1.png';
import pplLogo from '../assets/ppl.png';

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

  const renderLeagueRow = (leagueCodes) => (
    <motion.div className="league-row" variants={containerVariants}>
      {leagueCodes.map(code => (
        <motion.div
          key={code}
          className="league-card"
          onClick={() => handleLeagueSelect(code)}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-league-code={code}
        >
          <img src={leagueLogos[code]} alt={`${LEAGUE_NAMES[code]} logo`} className="league-logo" />
          <span className="league-name-home">{LEAGUE_NAMES[code]}</span>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="home-container">
      <div className="football-icon">⚽</div>

      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="hero-title">Welcome to Football Hub</h1>
        <p className="hero-subtitle">Your one-stop destination for live scores, standings, and fixtures from the world's top football leagues.</p>
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

