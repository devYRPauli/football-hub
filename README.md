# Football Hub

A modern, responsive web application for viewing football league standings, fixtures, and top scorers across major European leagues. Built with React and Express.js, powered by the Football-Data.org API.

## Features

- **7 Major Leagues**: Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, and Primeira Liga
- **Three Views**:
  - League Standings with real-time positions
  - Upcoming and past fixtures with scores
  - Top scorers leaderboard
- **Interactive Modals**:
  - Team details including squad, coach, stadium, and competitions
  - Match details with venue information and head-to-head stats
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Search Functionality**: Quick team search in standings view
- **Smooth Animations**: Framer Motion powered transitions
- **Rate Limiting Protection**: Built-in cooldown handling for API limits
- **Responsive Design**: Optimized for desktop and mobile devices
- **Accessibility**: Full keyboard navigation and ARIA labels for screen readers
- **Cross-Browser Support**: Custom scrollbars work in Chrome, Safari, Firefox, and Edge

## Tech Stack

### Frontend

- React 18
- React Router v6
- Axios for API calls
- Framer Motion for animations
- CSS3 with custom properties for theming

### Backend

- Node.js with Express
- Axios for external API calls
- Node-cache for response caching (5-minute TTL)
- Helmet for security headers
- Express-rate-limit for API protection
- CORS middleware

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Football-Data.org API key ([Get one free here](https://www.football-data.org/client/register))

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd football-hub
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Football-Data.org API key:

```env
FOOTBALL_API_KEY=your_actual_api_key_here
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

The default `.env` should contain:

```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Production Deployment

### Backend Deployment (Render.com)

1. **Create a new Web Service** on [Render.com](https://render.com)
2. **Connect your GitHub repository**
3. **Configure the service:**
   - Name: `football-hub-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add Environment Variables:**
   - `FOOTBALL_API_KEY`: Your Football-Data.org API key
   - `PORT`: 3001 (or leave blank, Render will assign one)
   - `CORS_ORIGIN`: Your frontend URL (add after frontend deployment)
5. **Deploy** and copy the backend URL (e.g., `https://football-hub-backend.onrender.com`)

**Note:** Render free tier may have cold starts. The first request might take 30-60 seconds.

### Frontend Deployment (Vercel)

1. **Import your repository** on [Vercel](https://vercel.com)
2. **Configure the project:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
3. **Add Environment Variables:**
   - Key: `REACT_APP_API_BASE_URL`
   - Value: Your backend URL from Render (e.g., `https://football-hub-backend.onrender.com`)
4. **Deploy** and copy the frontend URL

### Final Configuration

After both are deployed:

1. Go back to your backend on Render
2. Update the `CORS_ORIGIN` environment variable with your Vercel frontend URL
3. Redeploy the backend for changes to take effect

## Project Structure

```
football-hub/
├── backend/
│   ├── server.js           # Express server with API endpoints
│   ├── package.json
│   ├── .env.example        # Environment variables template
│   └── .env                # Your environment variables (not in git)
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── modals/     # Team and Match modals
│   │   │   └── Skeletons.js
│   │   ├── views/          # Main views (Home, LeagueView)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── animations/     # Framer Motion variants
│   │   ├── assets/         # League logos
│   │   ├── constants.js    # League configurations
│   │   └── App.js          # Main app component
│   ├── package.json
│   ├── .env.example        # Environment variables template
│   └── .env                # Your environment variables (not in git)
└── README.md
```

## API Endpoints

### Backend API Routes

- `GET /api/league-data/:leagueCode` - Get standings, matches, and scorers
- `GET /api/team/:teamId` - Get detailed team information
- `GET /api/match/:matchId` - Get detailed match information with head-to-head

### League Codes

- `PL` - Premier League
- `PD` - La Liga
- `BL1` - Bundesliga
- `SA` - Serie A
- `FL1` - Ligue 1
- `CL` - Champions League
- `PPL` - Primeira Liga

## Features in Detail

### Caching

The backend implements a 5-minute cache for all API responses to minimize external API calls and improve performance.

### Rate Limiting

- Backend: 100 requests per 15 minutes per IP
- Frontend: Built-in cooldown detection with countdown timer

### Security

- Helmet.js for security headers
- CORS protection with configurable origins
- Input validation on all API endpoints (league codes, team IDs, match IDs)
- Protection against path injection attacks
- Request timeouts (10 seconds)
- Environment variable validation on startup
- Safe localStorage access with fallback for private browsing

### Error Handling

- Graceful error messages for users
- Detailed error logging on the backend
- Null-safe rendering throughout the frontend
- Network failure handling
- Image fallback for missing team crests
- API URL validation with local fallback
- Protected against localStorage errors in private browsing mode

### Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader friendly
- Tab navigation through league cards, team names, and match cards
- Role attributes for proper semantic HTML
- Focus indicators for keyboard users

## Known Limitations

- Champions League Top Scorers view is disabled (API limitation)
- Free tier API has rate limits (10 requests per minute)
- Backend cold starts on free hosting platforms

## Development Scripts

### Backend

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend

```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

## Environment Variables

### Backend (.env)

```env
FOOTBALL_API_KEY=your_api_key          # Required
PORT=3001                               # Optional
CORS_ORIGIN=http://localhost:3000      # Required for production
```

### Frontend (.env)

```env
REACT_APP_API_BASE_URL=http://localhost:3001   # Required
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Football data provided by [Football-Data.org](https://www.football-data.org/)
- League logos are property of their respective organizations
- Built with React and Express.js

## Support

If you encounter any issues or have questions:

1. Check that your API key is valid and active
2. Ensure all environment variables are set correctly
3. Check the browser console and backend logs for error messages
4. Verify you haven't exceeded API rate limits

## Production Readiness

This application has been audited and hardened for production deployment with:

- Input validation and security hardening
- Comprehensive error handling
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Full accessibility compliance
- Mobile-responsive design
- Performance optimizations (caching, efficient re-renders)

---

**Enjoy exploring football data!**
