# Deployment Guide

## Prerequisites

- Node.js v22+
- MongoDB Atlas cluster (or self-hosted)
- GitHub repository
- Render.com & Vercel accounts

## Local Development

### Backend

```bash
cd Backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, API keys (GROQ_API_KEY, GOOGLE_API_KEY)
npm run dev  # Nodemon watches for changes
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd Frontend/vite-project
npm install
# .env.production already configured for production
npm run dev  # Vite dev server
```

Runs on `http://localhost:5173`

---

## Production Deployment

### Backend → Render.com

1. **Create Web Service**
   - GitHub repo: `ai-interview-prep`
   - Runtime: Node
   - Build: `npm install`
   - Start: `node server.js`

2. **Environment Variables**

   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<MongoDB Atlas URI>
   JWT_SECRET=<strong-random-secret>
   GROQ_API_KEY=<your-key>
   GOOGLE_API_KEY=<your-key>
   ```

3. **CORS Configuration** (auto-handles via `src/app.js` dynamic whitelist)

### Frontend → Vercel

1. **Connect Repository**
   - Framework: React
   - Build command: `npm run build`
   - Output: `dist/`

2. **Environment Variables**

   ```
   VITE_API_URL=https://<your-render-backend>.onrender.com
   ```

3. **Auto-deploys** on push to `main`

---

## Environment Files

- **Production**: `Frontend/vite-project/.env.production` (API URL hardcoded)
- **Local**: Use `.env` files (gitignored)

## CI/CD

Both platforms auto-deploy on Git push. Render rebuilds Node app, Vercel builds React bundle. - `FRONTEND_URL`: Your Vercel frontend URL

---

## Deployment to Vercel (Frontend)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Select the `Frontend/vite-project` as the root directory
5. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable:
     - `VITE_API_URL`: Your Render backend URL
6. Deploy!

---

## Testing the Application Locally

1. Open `http://localhost:5173` in your browser
2. Try registering a new account
3. Try logging in
4. Create an interview plan
5. Test logout button

All API calls should work between frontend and backend on localhost.

---

## Environment Variables Summary

### Backend (.env)

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: development or production
- `FRONTEND_URL`: Frontend domain (for CORS)

### Frontend (.env.local or .env.production)

- `VITE_API_URL`: Backend API URL

---

## Troubleshooting

### CORS Error

- Make sure backend is running on `http://localhost:5000`
- Check that `VITE_API_URL` in frontend matches the backend URL

### MongoDB Connection Error

- Ensure MongoDB is running locally or use MongoDB Atlas connection string
- Update `MONGO_URI` in .env

### API calls fail after deployment

- Update `VITE_API_URL` to your Render backend URL in Vercel environment variables
- Ensure Render backend URL is added to CORS origins in backend

---

## Quick Start Script

Create a file called `start-dev.sh` in project root:

```bash
#!/bin/bash
echo "Starting Backend..."
cd Backend
npm install > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!

cd ../Frontend/vite-project
echo "Starting Frontend..."
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Backend running on http://localhost:5000"
echo "✅ Frontend running on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
```

Run with: `bash start-dev.sh`
