require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// --- Security and Caching Setup ---
const apiCache = new NodeCache({ stdTTL: 300 });

app.use(helmet());
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter); // Apply rate limiter to all requests


app.use(cors());


// --- Axios Instance with Timeout ---
const api = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY },
  timeout: 10000,
});

// --- Enhanced Error Handling ---
const handleApiError = (res, error, context) => {
    if (error.code === 'ECONNABORTED') {
        console.error(`API Timeout Error on ${context}:`, error.message);
        return res.status(504).json({ message: 'The request to the data provider timed out.' });
    }
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || `Failed to fetch ${context}.`;
    console.error(`API Error on ${context} (Status: ${status}):`, message);
    return res.status(status).json({ message });
};

// --- Cache Middleware ---
const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    if (apiCache.has(key)) {
        console.log(`CACHE HIT: ${key}`);
        return res.json(apiCache.get(key));
    }
    console.log(`CACHE MISS: ${key}`);
    next();
};

// --- API Routes ---
app.get('/api/league-data/:leagueCode', cacheMiddleware, async (req, res) => {
    const { leagueCode } = req.params;
    try {
        const endpoints = [
            `/competitions/${leagueCode}/standings`,
            `/competitions/${leagueCode}/matches`,
        ];
        if (leagueCode !== 'CL') {
            endpoints.push(`/competitions/${leagueCode}/scorers`);
        }
        
        const requests = endpoints.map(endpoint => api.get(endpoint));
        const results = await Promise.allSettled(requests);

        let hasFailedRequest = false;
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                hasFailedRequest = true;
                console.error(`--> Request to endpoint '${endpoints[index]}' FAILED.`);
                console.error(`--> Reason:`, result.reason.message);
            }
        });

        if (hasFailedRequest) {
            return res.status(502).json({ message: 'Failed to fetch data from the provider. Check backend logs for details.' });
        }

        const standingsData = results[0].value.data.standings;
        const matchesData = results[1].value.data.matches;
        const scorersData = results.length > 2 ? results[2].value.data.scorers : [];

        const responseData = { standings: standingsData, matches: matchesData, scorers: scorersData };
        apiCache.set(req.originalUrl, responseData);
        res.json(responseData);

    } catch (error) {
        handleApiError(res, error, `league data for ${leagueCode}`);
    }
});

app.get('/api/team/:teamId', cacheMiddleware, async (req, res) => {
    try {
        const response = await api.get(`/teams/${req.params.teamId}`);
        apiCache.set(req.originalUrl, response.data);
        res.json(response.data);
    } catch (error) {
        handleApiError(res, error, `team ${req.params.teamId}`);
    }
});

app.get('/api/match/:matchId', cacheMiddleware, async (req, res) => {
    try {
        const response = await api.get(`/matches/${req.params.matchId}`);
        apiCache.set(req.originalUrl, response.data);
        res.json(response.data);
    } catch (error) {
        handleApiError(res, error, `match ${req.params.matchId}`);
    }
});


// --- Export the app for Vercel ---
module.exports = app;
