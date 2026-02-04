import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { LEAGUE_NAMES } from '../constants';

// Use the environment variable for the base API URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Warn if API URL is not configured
if (!process.env.REACT_APP_API_BASE_URL) {
  console.warn('REACT_APP_API_BASE_URL not set, using default: http://localhost:3001');
}

function useLeagueData(leagueCode) {
  const [data, setData] = useState({ standings: [], matches: [], scorers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  
  // Use useRef to store cache without triggering re-renders
  const cachedDataRef = useRef({});

  const fetchData = useCallback(async () => {
    if (isOnCooldown) return;
    
    // Check cache in ref
    if (cachedDataRef.current[leagueCode]) {
      setData(cachedDataRef.current[leagueCode]);
      setLoading(false);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Use the new API_BASE_URL variable in the request
      const response = await axios.get(`${API_BASE_URL}/api/league-data/${leagueCode}`);
      const newData = response.data;
      setData(newData);
      // Store in ref instead of state
      cachedDataRef.current[leagueCode] = newData;
    } catch (err) {
      if (err.response?.status === 429) {
        setIsOnCooldown(true);
        setCooldownTimer(60);
      } else {
        setError(`Failed to fetch data for ${LEAGUE_NAMES[leagueCode]}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [leagueCode, isOnCooldown]);

  useEffect(() => {
    fetchData();
  }, [leagueCode]);

  useEffect(() => {
    if (!isOnCooldown) return;
    if (cooldownTimer <= 0) {
      setIsOnCooldown(false);
      fetchData();
      return;
    }
    const timerId = setInterval(() => setCooldownTimer(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [isOnCooldown, cooldownTimer, fetchData]);

  return { data, loading, error, isOnCooldown, cooldownTimer };
}

export default useLeagueData;

