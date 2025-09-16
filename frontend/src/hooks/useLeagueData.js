import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LEAGUE_NAMES } from '../constants';

// Use the environment variable for the base API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function useLeagueData(leagueCode) {
  const [data, setData] = useState({ standings: [], matches: [], scorers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cachedData, setCachedData] = useState({});
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const fetchData = useCallback(async () => {
    if (isOnCooldown) return;
    if (cachedData[leagueCode]) {
      setData(cachedData[leagueCode]);
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
      setCachedData(prev => ({ ...prev, [leagueCode]: newData }));
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
  }, [leagueCode, cachedData, isOnCooldown]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

