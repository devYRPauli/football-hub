import React from 'react';

const SkeletonRow = () => (
  <tr>
    <td><div className="skeleton skeleton-text" style={{ width: '20px' }}></div></td>
    <td><div className="skeleton skeleton-crest"></div></td>
    <td><div className="skeleton skeleton-text"></div></td>
    <td><div className="skeleton skeleton-text" style={{ width: '30px' }}></div></td>
    <td><div className="skeleton skeleton-text" style={{ width: '30px' }}></div></td>
    <td><div className="skeleton skeleton-text" style={{ width: '30px' }}></div></td>
    <td><div className="skeleton skeleton-text" style={{ width: '30px' }}></div></td>
    <td><div className="skeleton skeleton-text" style={{ width: '40px' }}></div></td>
  </tr>
);

export const StandingsSkeleton = () => (
    <table className="standings-table">
        <thead>
            <tr><th>Pos</th><th colSpan="2">Club</th><th>MP</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>
        </thead>
        <tbody>{[...Array(10)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
    </table>
);

export const FixturesSkeleton = () => (
    <div className="fixtures-list">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="match-card skeleton-card">
                <div className="skeleton skeleton-text" style={{ width: '80%', height: '24px'}}></div>
                <div className="skeleton skeleton-text" style={{ width: '50%', height: '16px' }}></div>
            </div>
        ))}
    </div>
);

export const ScorersSkeleton = () => (
    <table className="standings-table">
        <thead>
            <tr><th>Player</th><th>Team</th><th>Goals</th></tr>
        </thead>
        <tbody>
            {[...Array(10)].map((_, i) => (
                <tr key={i}>
                    <td><div className="skeleton skeleton-text"></div></td>
                    <td><div className="skeleton skeleton-text"></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '40px' }}></div></td>
                </tr>
            ))}
        </tbody>
    </table>
);
