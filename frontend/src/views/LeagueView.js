// --- React and Router Imports ---
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Project Imports ---
import { LEAGUE_NAMES } from '../constants';
import useLeagueData from '../hooks/useLeagueData';
import { formatMatchStatus } from '../utils/formatters';
import { listContainerVariants, listItemVariants } from '../animations/variants';
import './LeagueView.css';

// --- Component Imports ---
import { StandingsSkeleton, FixturesSkeleton, ScorersSkeleton } from '../components/Skeletons';
import TeamModal from '../components/modals/TeamModal';
import MatchModal from '../components/modals/MatchModal';

// --- Main View Component ---
function LeagueView() {
    // Hooks for routing and navigation
    const { leagueCode, view } = useParams();
    const navigate = useNavigate();

    // Custom hook to manage all data fetching, caching, and cooldown logic
    const { data, loading, error, isOnCooldown, cooldownTimer } = useLeagueData(leagueCode);

    // State for search and modal visibility
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);

    // Effect to handle navigation bug when switching to CL from a scorers page
    useEffect(() => {
        if (leagueCode === 'CL' && view === 'scorers') {
            navigate(`/league/CL/standings`, { replace: true });
        }
    }, [leagueCode, view, navigate]);

    // Memoized filtering for the standings table based on search term
    const filteredStandings = useMemo(() => {
        if (!data.standings || data.standings.length === 0) return [];
        if (!searchTerm) return data.standings;
        const lowercasedFilter = searchTerm.toLowerCase();

        if (leagueCode === 'CL') {
          return data.standings.map(group => ({
            ...group, table: (group.table || []).filter(teamRow => teamRow.team.name.toLowerCase().includes(lowercasedFilter)),
          })).filter(group => group.table.length > 0);
        } else {
          return [{ ...data.standings[0], table: (data.standings[0]?.table || []).filter(teamRow => teamRow.team.name.toLowerCase().includes(lowercasedFilter)) }];
        }
    }, [data.standings, searchTerm, leagueCode]);

    // --- Render Functions for each view ---

    const renderStandings = () => {
        const dataToRender = filteredStandings;
        if (!dataToRender || dataToRender.length === 0) {
            return <p className="no-data-message">No standings data available</p>;
        }
        // Special rendering for Champions League group stage
        if (leagueCode === 'CL') {
          return dataToRender.map((group, index) => (
            <motion.div 
              key={group.group || `group-${index}`} 
              className="group-container"
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="group-header">{(group.group || 'Group Stage').replace(/_/g, ' ')}</h3>
              <div className="standings-table-wrapper">
                <table className="standings-table">
                  <thead><tr><th>Pos</th><th colSpan="2">Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead>
                  <tbody>{group.table.map((teamRow) => (<motion.tr variants={listItemVariants} key={teamRow.team.id}><td>{teamRow.position}</td><td><img src={teamRow.team.crest} alt={`${teamRow.team.name} crest`} className="team-crest" /></td><td className="team-name" onClick={() => setSelectedTeam(teamRow.team)}>{teamRow.team.name}</td><td>{teamRow.playedGames}</td><td>{teamRow.won}</td><td>{teamRow.draw}</td><td>{teamRow.lost}</td><td><strong>{teamRow.points}</strong></td></motion.tr>))}</tbody>
                </table>
              </div>
            </motion.div>
          ));
        }
        // Standard rendering for domestic leagues
        return (
            <div className="standings-table-wrapper">
                <motion.table 
                  className="standings-table"
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <thead><tr><th>Pos</th><th colSpan="2">Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead>
                  <tbody>{(dataToRender[0]?.table || []).map((teamRow) => (<motion.tr variants={listItemVariants} key={teamRow.team.id}><td>{teamRow.position}</td><td><img src={teamRow.team.crest} alt={`${teamRow.team.name} crest`} className="team-crest" /></td><td className="team-name" onClick={() => setSelectedTeam(teamRow.team)}>{teamRow.team.name}</td><td>{teamRow.playedGames}</td><td>{teamRow.won}</td><td>{teamRow.draw}</td><td>{teamRow.lost}</td><td><strong>{teamRow.points}</strong></td></motion.tr>))}</tbody>
                </motion.table>
            </div>
        );
    };

    const renderFixtures = () => {
        if (!data.matches || data.matches.length === 0) {
            return <p className="no-data-message">No fixtures available</p>;
        }
        return (
        <motion.div 
          className="fixtures-list"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.matches.map((match) => (
            <motion.div 
              variants={listItemVariants} 
              key={match.id} 
              className="match-card" 
              onClick={() => setSelectedMatch(match)}
            >
              <div className="match-card-content">
                <div className="match-teams">
                  <div className="team-layout">
                    <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="team-crest-small" />
                    <span className="team-name-fixture">{match.homeTeam.name}</span>
                  </div>
                  <span className="score-fixture">
                    {match.score.fullTime.home ?? '-'} : {match.score.fullTime.away ?? '-'}
                  </span>
                  <div className="team-layout away">
                    <span className="team-name-fixture">{match.awayTeam.name}</span>
                    <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="team-crest-small" />
                  </div>
                </div>
              </div>
              <div className="match-card-footer">
                {/* Correctly display the date and the status badge */}
                <span>{new Date(match.utcDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="match-status" data-status={match.status}>{formatMatchStatus(match.status)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        );
    };
    
    const renderScorers = () => {
        if (!data.scorers || data.scorers.length === 0) {
            return <p className="no-data-message">No scorers data available</p>;
        }
        return (
      <div className="standings-table-wrapper">
        <motion.table 
          className="standings-table"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
            <thead><tr><th>Player</th><th>Team</th><th>Goals</th></tr></thead>
            <tbody>{data.scorers.map(scorer => (<motion.tr variants={listItemVariants} key={scorer.player.id}><td>{scorer.player.name}</td><td>{scorer.team.name}</td><td><strong>{scorer.goals}</strong></td></motion.tr>))}</tbody>
        </motion.table>
      </div>
        );
    };

    // Main render function to decide what to show: loading, error, or content
    const renderContent = () => {
        if (loading) {
            if (view === 'standings') return <StandingsSkeleton />;
            if (view === 'fixtures') return <FixturesSkeleton />;
            if (view === 'scorers') return <ScorersSkeleton />;
        }
        if (error) return <p className="error-message">{error}</p>;
        if (isOnCooldown) return <p className="error-message cooldown-message">Too many requests. Please wait... {cooldownTimer}s</p>;
        
        // Prevent rendering invalid view while navigating away
        if (leagueCode === 'CL' && view === 'scorers') {
            return null;
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={view} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {view === 'standings' && renderStandings()}
                    {view === 'fixtures' && renderFixtures()}
                    {view === 'scorers' && renderScorers()}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <>
            {/* --- Top Control Panel --- */}
            <div className="controls-wrapper">
                <nav className="league-selector">
                    {Object.keys(LEAGUE_NAMES).map((code) => (
                        <button key={code} className={leagueCode === code ? 'active' : ''} onClick={() => navigate(`/league/${code}/${view}`)} disabled={isOnCooldown}>{LEAGUE_NAMES[code]}</button>
                    ))}
                </nav>

                {view === 'standings' && (
                    <div className="search-container">
                        <input type="text" placeholder="Search for a team..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                )}
                
                <div className="view-selector">
                    <button className={view === 'standings' ? 'active' : ''} onClick={() => navigate(`/league/${leagueCode}/standings`)}>Standings</button>
                    <button className={view === 'fixtures' ? 'active' : ''} onClick={() => navigate(`/league/${leagueCode}/fixtures`)}>Fixtures</button>
                    {/* Hide Top Scorers button for Champions League */}
                    {leagueCode !== 'CL' && (
                        <button className={view === 'scorers' ? 'active' : ''} onClick={() => navigate(`/league/${leagueCode}/scorers`)}>Top Scorers</button>
                    )}
                </div>
            </div>

            {/* --- Main Data Display Area --- */}
            <main className="App-content">
                <h2>{LEAGUE_NAMES[leagueCode]} - {view.charAt(0).toUpperCase() + view.slice(1)}</h2>
                {renderContent()}
            </main>

            {/* --- Modals --- */}
            <AnimatePresence>
                {selectedTeam && (
                    <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
                )}
                {selectedMatch && (
                    <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
                )}
            </AnimatePresence>
        </>
    );
}

export default LeagueView;

