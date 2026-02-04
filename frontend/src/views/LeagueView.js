// --- React and Router Imports ---
import React, { useState, useEffect } from 'react';
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

// Placeholder image for missing team crests
const PLACEHOLDER_CREST = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Ccircle cx="12" cy="12" r="10" stroke-width="2"/%3E%3Cpath d="M12 6v6l4 2" stroke-width="2"/%3E%3C/svg%3E';

// --- Main View Component ---
function LeagueView() {
    // Hooks for routing and navigation
    const { leagueCode, view } = useParams();
    const navigate = useNavigate();

    // Custom hook to manage all data fetching, caching, and cooldown logic
    const { data, loading, error, isOnCooldown, cooldownTimer } = useLeagueData(leagueCode);

    // State for modal visibility and fixtures tab
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [fixturesTab, setFixturesTab] = useState('upcoming');

    // Keyboard handler for table rows
    const handleTeamKeyDown = (event, team) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedTeam(team);
        }
    };

    // Effect to handle navigation bug when switching to CL from a scorers page
    useEffect(() => {
        if (leagueCode === 'CL' && view === 'scorers') {
            navigate(`/league/CL/standings`, { replace: true });
        }
    }, [leagueCode, view, navigate]);


    // --- Render Functions for each view ---

    const renderStandings = () => {
        if (!data.standings || data.standings.length === 0) {
            return <p className="no-data-message">No standings data available</p>;
        }
        // Special rendering for Champions League group stage
        if (leagueCode === 'CL') {
          return data.standings.map((group, index) => (
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
                  <tbody>{group.table.map((teamRow) => (<motion.tr variants={listItemVariants} key={teamRow.team.id}><td>{teamRow.position}</td><td><img src={teamRow.team.crest || PLACEHOLDER_CREST} alt={`${teamRow.team.name} crest`} className="team-crest" /></td><td className="team-name" onClick={() => setSelectedTeam(teamRow.team)} onKeyDown={(e) => handleTeamKeyDown(e, teamRow.team)} tabIndex={0} role="button" aria-label={`View ${teamRow.team.name} details`}>{teamRow.team.name}</td><td>{teamRow.playedGames}</td><td>{teamRow.won}</td><td>{teamRow.draw}</td><td>{teamRow.lost}</td><td><strong>{teamRow.points}</strong></td></motion.tr>))}</tbody>
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
                  <tbody>{(data.standings[0]?.table || []).map((teamRow) => (<motion.tr variants={listItemVariants} key={teamRow.team.id}><td>{teamRow.position}</td><td><img src={teamRow.team.crest || PLACEHOLDER_CREST} alt={`${teamRow.team.name} crest`} className="team-crest" /></td><td className="team-name" onClick={() => setSelectedTeam(teamRow.team)} onKeyDown={(e) => handleTeamKeyDown(e, teamRow.team)} tabIndex={0} role="button" aria-label={`View ${teamRow.team.name} details`}>{teamRow.team.name}</td><td>{teamRow.playedGames}</td><td>{teamRow.won}</td><td>{teamRow.draw}</td><td>{teamRow.lost}</td><td><strong>{teamRow.points}</strong></td></motion.tr>))}</tbody>
                </motion.table>
            </div>
        );
    };

    const renderFixtures = () => {
        if (!data.matches || data.matches.length === 0) {
            return <p className="no-data-message">No fixtures available</p>;
        }

        // Split matches into upcoming and past
        const now = new Date();
        const upcomingMatches = data.matches
            .filter(m => new Date(m.utcDate) > now)
            .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
        
        const pastMatches = data.matches
            .filter(m => new Date(m.utcDate) <= now)
            .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

        const matchesToDisplay = fixturesTab === 'upcoming' ? upcomingMatches : pastMatches;

        return (
            <>
                {/* Fixtures Sub-tabs */}
                <div className="fixtures-tabs" role="tablist">
                    <button 
                        className={fixturesTab === 'upcoming' ? 'active' : ''} 
                        onClick={() => setFixturesTab('upcoming')}
                        role="tab"
                        aria-selected={fixturesTab === 'upcoming'}
                        aria-label={`View upcoming matches (${upcomingMatches.length} matches)`}
                    >
                        Upcoming ({upcomingMatches.length})
                    </button>
                    <button 
                        className={fixturesTab === 'results' ? 'active' : ''} 
                        onClick={() => setFixturesTab('results')}
                        role="tab"
                        aria-selected={fixturesTab === 'results'}
                        aria-label={`View past results (${pastMatches.length} matches)`}
                    >
                        Results ({pastMatches.length})
                    </button>
                </div>

                {/* Display matches based on active tab */}
                {matchesToDisplay.length === 0 ? (
                    <p className="no-data-message">
                        No {fixturesTab === 'upcoming' ? 'upcoming' : 'past'} matches available
                    </p>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={fixturesTab}
                            className="fixtures-list"
                            variants={listContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {matchesToDisplay.map((match) => (
                                <motion.div 
                                    variants={listItemVariants} 
                                    key={match.id} 
                                    className="match-card" 
                                    onClick={() => setSelectedMatch(match)}
                                >
                                    <div className="match-card-content">
                                        <div className="match-teams">
                                            <div className="team-layout">
                                                <img src={match.homeTeam.crest || PLACEHOLDER_CREST} alt={match.homeTeam.name} className="team-crest-small" />
                                                <span className="team-name-fixture">{match.homeTeam.name}</span>
                                            </div>
                                            <span className="score-fixture">
                                                {match.score.fullTime.home ?? '-'} : {match.score.fullTime.away ?? '-'}
                                            </span>
                                            <div className="team-layout away">
                                                <span className="team-name-fixture">{match.awayTeam.name}</span>
                                                <img src={match.awayTeam.crest || PLACEHOLDER_CREST} alt={match.awayTeam.name} className="team-crest-small" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="match-card-footer">
                                        <span className="match-date">
                                            {new Date(match.utcDate).toLocaleDateString(undefined, { 
                                                weekday: 'short', 
                                                month: 'short', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {match.status && (
                                            <span className="match-status" data-status={match.status}>
                                                {formatMatchStatus(match.status)}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </>
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
            {/* --- Floating Home Button --- */}
            <button className="floating-home-button" onClick={() => navigate('/')} aria-label="Go to home">
                Home
            </button>

            {/* --- Top Control Panel --- */}
            <div className="controls-wrapper">
                <div className="view-selector">
                    <button className={view === 'standings' ? 'active' : ''} onClick={() => navigate(`/league/${leagueCode}/standings`)}>Standings</button>
                    <button className={view === 'fixtures' ? 'active' : ''} onClick={() => navigate(`/league/${leagueCode}/fixtures`)}>Fixtures</button>
                    {/* Hide Top Scorers button for Champions League */}
                    {leagueCode !== 'CL' && (
                        <button className={view === 'scorers' ? 'active' : ''} onClick={() => navigate(`/league/${leagueCode}/scorers`)}>Top Scorers</button>
                    )}
                </div>
            </div>

            {/* --- Page Title --- */}
            <h2 className="page-title">{LEAGUE_NAMES[leagueCode]} - {view.charAt(0).toUpperCase() + view.slice(1)}</h2>

            {/* --- Main Data Display Area --- */}
            <main className="App-content">
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

