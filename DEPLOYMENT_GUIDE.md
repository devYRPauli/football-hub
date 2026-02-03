# 🚀 Deployment Guide for Football Hub

This guide will walk you through deploying your Football Hub application to production.

## ✅ Pre-Deployment Checklist

All critical bugs have been fixed:
- ✅ Backend CORS configuration (now uses environment variable)
- ✅ Environment variable validation added
- ✅ All null reference errors fixed in frontend
- ✅ Match modal head-to-head stats bug fixed
- ✅ Environment configuration files created (.env.example)
- ✅ README documentation updated

## 📦 Step 1: Commit and Push Changes

If you haven't already, commit the fixed code to your repository:

```bash
git add .
git commit -m "Fix critical bugs and prepare for deployment"
git push origin main
```

## 🔧 Step 2: Deploy Backend to Render

### Option A: Using Render.com (Recommended)

1. **Go to [Render.com](https://render.com)** and sign in (or create account)

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**
   - Select your `football-hub` repository
   - Click "Connect"

4. **Configure the Web Service:**
   ```
   Name: football-hub-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Select Plan:**
   - Choose "Free" (good for testing)
   - Note: Free tier has cold starts (30-60s delay on first request)

6. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   FOOTBALL_API_KEY = your_actual_api_key_here
   PORT = 3001
   ```
   
   Note: We'll add CORS_ORIGIN after frontend deployment

7. **Click "Create Web Service"**

8. **Wait for deployment** (2-3 minutes)

9. **Copy your backend URL** (e.g., `https://football-hub-backend.onrender.com`)
   - Find it at the top of your service page
   - Save this URL - you'll need it for frontend deployment

### Option B: Using Railway.app

1. **Go to [Railway.app](https://railway.app)** and sign in

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Configure:**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables:**
   ```
   FOOTBALL_API_KEY = your_actual_api_key_here
   PORT = 3001
   ```

6. **Deploy and copy the URL**

## 🎨 Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign in

2. **Click "Add New..." → "Project"**

3. **Import your Git repository**
   - Find and select your `football-hub` repository
   - Click "Import"

4. **Configure Project:**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: build (auto-detected)
   Install Command: npm install (auto-detected)
   ```

5. **Add Environment Variables:**
   Click "Environment Variables"
   
   Add:
   ```
   Name: REACT_APP_API_BASE_URL
   Value: [YOUR_BACKEND_URL_FROM_RENDER]
   
   Example: https://football-hub-backend.onrender.com
   ```
   
   **Important:** 
   - Use the EXACT URL from your Render backend
   - Do NOT include a trailing slash
   - Do NOT include `/api` at the end

6. **Click "Deploy"**

7. **Wait for deployment** (2-3 minutes)

8. **Copy your frontend URL** (e.g., `https://football-hub-abc123.vercel.app`)

## 🔗 Step 4: Update Backend CORS

Now that your frontend is deployed, update the backend CORS setting:

1. **Go back to Render** (your backend service)

2. **Navigate to "Environment"**

3. **Add new environment variable:**
   ```
   Name: CORS_ORIGIN
   Value: [YOUR_VERCEL_FRONTEND_URL]
   
   Example: https://football-hub-abc123.vercel.app
   ```
   
   **Important:**
   - Use the EXACT URL from Vercel
   - Do NOT include a trailing slash

4. **Click "Save Changes"**

5. **Wait for automatic redeploy** (1-2 minutes)

## ✅ Step 5: Test Your Deployment

1. **Open your frontend URL** in a browser

2. **Test all major features:**
   - ✅ Home page loads
   - ✅ Select a league (e.g., Premier League)
   - ✅ View Standings - check data loads
   - ✅ View Fixtures - check matches display
   - ✅ View Top Scorers - check scorers list
   - ✅ Click on a team - modal opens with details
   - ✅ Click on a match - modal opens with details
   - ✅ Test theme toggle (light/dark)
   - ✅ Test search functionality in standings

3. **Check for errors:**
   - Open browser DevTools (F12)
   - Check Console tab for any errors
   - Verify Network tab shows successful API calls

## 🐛 Troubleshooting

### Frontend shows "Failed to fetch" errors

**Solution:**
- Check that `REACT_APP_API_BASE_URL` in Vercel matches your backend URL exactly
- Verify backend is running (visit backend URL directly)
- Check CORS_ORIGIN in backend matches frontend URL exactly

### Backend shows CORS errors

**Solution:**
- Verify CORS_ORIGIN environment variable is set in Render
- Ensure it matches your Vercel URL exactly (no trailing slash)
- Redeploy backend after changing environment variables

### Backend takes 30-60 seconds on first request

**Solution:**
- This is normal for Render's free tier (cold start)
- Consider upgrading to paid tier for production
- Or switch to Railway/Heroku

### "FOOTBALL_API_KEY is required" error

**Solution:**
- Make sure FOOTBALL_API_KEY is set in Render environment variables
- Verify your API key is valid at football-data.org
- Redeploy after adding the variable

### Frontend shows old version after deployment

**Solution:**
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private browsing mode

## 🎯 Optional Enhancements

### Custom Domain (Vercel)

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update CORS_ORIGIN in backend to include new domain

### Custom Domain (Render)

1. Upgrade to paid plan
2. Go to Settings → Custom Domain
3. Add your domain and configure DNS

### Enable Continuous Deployment

Both Vercel and Render automatically redeploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
# Automatic deployment will trigger!
```

## 📊 Monitoring

### Render Dashboard
- View logs: Service → Logs
- Monitor deployments: Service → Events
- Check metrics: Service → Metrics

### Vercel Dashboard
- View deployments: Project → Deployments
- Check logs: Deployment → Build Logs / Function Logs
- Monitor analytics: Project → Analytics (paid feature)

## 🔐 Security Checklist

- ✅ Environment variables not in git (.env files ignored)
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Security headers (Helmet.js) enabled
- ✅ Request timeouts configured
- ✅ API key validation on startup

## 💰 Cost Estimate

**Free Tier (Recommended for testing):**
- Render Backend: Free (with cold starts)
- Vercel Frontend: Free (hobby plan)
- Football-Data.org API: Free (10 req/min limit)
- **Total: $0/month**

**Production Tier (Recommended for public use):**
- Render Backend: $7/month (no cold starts)
- Vercel Frontend: $20/month (Pro plan)
- Football-Data.org API: Free or paid tiers
- **Total: ~$27/month**

## 📞 Need Help?

If deployment fails:
1. Check the logs in Render/Vercel dashboard
2. Verify all environment variables are set correctly
3. Test backend URL directly in browser
4. Check browser console for frontend errors
5. Ensure you're not exceeding API rate limits

---

**Once deployed, your Football Hub will be live and accessible worldwide! ⚽🌍**

## 🎉 Post-Deployment

After successful deployment:
1. Share your live URL with friends/portfolio
2. Update your GitHub README with live demo link
3. Consider adding a custom domain
4. Monitor usage and API limits
5. Plan for future enhancements

Congratulations on deploying your Football Hub! 🎊
