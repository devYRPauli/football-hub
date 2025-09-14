import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LEAGUE_NAMES } from '../constants';

// Custom hook to manage all data fetching, caching, and cooldown logic for a league
function useLeagueData(leagueCode) {
  const [data, setData] = useState({ standings: [], matches: [], scorers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cachedData, setCachedData] = useState({});
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const fetchData = useCallback(async () => {
    // Return early if on cooldown or if data is already cached
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
      // Use a relative path to fetch all league data from the serverless function
      const response = await axios.get(`/api/league-data/${leagueCode}`);
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

  // Effect to trigger a fetch when the league code changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect to manage the API cooldown timer
  useEffect(() => {
    if (!isOnCooldown) return;
    if (cooldownTimer <= 0) {
      setIsOnCooldown(false);
      fetchData(); // Refetch data once cooldown is over
      return;
    }
    const timerId = setInterval(() => setCooldownTimer(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [isOnCooldown, cooldownTimer, fetchData]);

  return { data, loading, error, isOnCooldown, cooldownTimer };
}

export default useLeagueData;

