# Setup & Deployment Checklist

## Local Development

### Backend

- [ ] `cd Backend && npm install`
- [ ] Configure `.env`:
  ```
  PORT=5000
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
  JWT_SECRET=<generate-strong-secret>
  NODE_ENV=development
  GROQ_API_KEY=<your-key>
  GOOGLE_API_KEY=<your-key>
  ```
- [ ] `npm run dev` → Runs on `localhost:5000`
- [ ] Health check: `curl http://localhost:5000/api/health`

### Frontend

- [ ] `cd Frontend/vite-project && npm install`
- [ ] `npm run dev` → Runs on `localhost:5173`
- [ ] Test auth flow: register → login → create interview → logout

---

## Production Deployment

### Render (Backend)

- [ ] Create Web Service from GitHub
- [ ] Set start command: `node server.js`
- [ ] Add env vars (MONGO_URI, JWT_SECRET, API keys)
- [ ] Verify `render.json` in repo root
- [ ] Test API endpoint after deploy

### Vercel (Frontend)

- [ ] Import project from GitHub
- [ ] Set env var: `VITE_API_URL=<render-backend-url>`
- [ ] Verify `vercel.json` in repo root
- [ ] Build succeeds: `npm run build` generates `dist/`
- [ ] Test endpoints post-deploy

### GitHub

- [ ] Push changes: `git push origin main`
- [ ] CI/CD auto-triggers on both platforms
- [ ] Monitor build logs

**Render Environment Variables Required:**

- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secure random string
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Your Vercel frontend domain
- [ ] `PORT` - Leave as 5000 (default)

### Frontend (Vercel)

**Files Created:**

- [ ] `Frontend/vite-project/.env.local` - Local development
- [ ] `Frontend/vite-project/.env.production` - Production environment
- [ ] `Frontend/vite-project/.env.example` - Template
- [ ] `Frontend/vite-project/vercel.json` - Vercel configuration

**Vercel Environment Variables Required:**

- [ ] `VITE_API_URL` - Your Render backend URL

---

## Code Updates Summary

### Backend Changes

✅ `Backend/src/app.js`

- Dynamic CORS configuration
- Supports environment-based origin whitelisting

✅ `Backend/src/controllers/auth.controller.js`

- All functions wrapped in try-catch blocks
- Proper error handling for unexpected errors

✅ `Backend/src/controllers/interview.controller.js`

- Resume upload now optional
- Accepts either resume OR self-description
- Validation error messages

### Frontend Changes

✅ `Frontend/vite-project/src/features/auth/service/auth.api.js`

- Uses `import.meta.env.VITE_API_URL` for dynamic API URL
- Fallback to localhost for development

✅ `Frontend/vite-project/src/features/interview/services/interview.api.js`

- Same environment variable approach
- Consistent with auth API

✅ `Frontend/vite-project/src/features/auth/pages/login.jsx`

- Error state management
- Error display as styled text

✅ `Frontend/vite-project/src/features/auth/pages/register.jsx`

- Error state management
- Error display as styled text

✅ `Frontend/vite-project/src/features/auth/auth.form.scss`

- `.error-message` styling added
- Consistent with dark theme

✅ `Frontend/vite-project/src/features/interview/pages/home.jsx`

- Logout button in top navigation
- useAuth hook integration
- Dynamic logout handling

✅ `Frontend/vite-project/src/features/interview/styles/home.scss`

- `.top-nav` styling
- `.logout-btn` styling with hover effects
- Fixed navigation bar

✅ `Frontend/vite-project/src/features/interview/hooks/useInterview.js`

- Improved error message extraction
- Better error propagation

---

## Deployment Guides Created

✅ `DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
✅ `setup.sh` - Automated setup script for Linux/macOS
✅ `setup.bat` - Automated setup script for Windows

---

## Quick Links

### Local Development

```bash
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Frontend
cd Frontend/vite-project && npm run dev
```

### Access Points

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API Docs: See `DEPLOYMENT_GUIDE.md`

### MongoDB

- Local: `mongodb://localhost:27017/ai-interview-prep`
- Remote: Use MongoDB Atlas connection string

---

## Before Deployment

### Backend Checklist

- [ ] All environment variables defined in `.env.example`
- [ ] `.env` file NOT committed to git
- [ ] CORS origins updated to include production frontend URL
- [ ] Error handling in all controllers
- [ ] Database connection tested
- [ ] API endpoints tested locally

### Frontend Checklist

- [ ] `.env.local` and `.env.production` configured
- [ ] `VITE_API_URL` points to correct backend
- [ ] All API calls use `import.meta.env.VITE_API_URL`
- [ ] Build tested locally: `npm run build && npm run preview`
- [ ] Production build optimized

### Git Configuration

- [ ] `.gitignore` files created
- [ ] No `.env` files in git history
- [ ] `.env.example` files committed as templates
- [ ] All necessary config files committed

---

## Deployment Steps

### 1. Deploy Backend to Render

```
1. Push code to GitHub (if not already)
2. Go to render.com
3. Create New → Web Service
4. Connect GitHub repository
5. Select Backend folder
6. Set environment variables
7. Deploy
8. Note your backend URL (e.g., https://my-app.onrender.com)
```

### 2. Deploy Frontend to Vercel

```
1. Go to vercel.com
2. Import GitHub repository
3. Select Root Directory: Frontend/vite-project
4. Add environment variable:
   VITE_API_URL=<your-render-url-from-step-1>
5. Deploy
6. Your app is live!
```

---

## Troubleshooting Checklist

### Application won't start locally

- [ ] All dependencies installed: `npm install`
- [ ] MongoDB running (check `mongod` process)
- [ ] Ports not in use: `lsof -i :5000` and `lsof -i :5173`
- [ ] Environment variables in `.env` file

### API calls fail (CORS error)

- [ ] Backend running on `http://localhost:5000`
- [ ] `VITE_API_URL=http://localhost:5000` in `.env.local`
- [ ] Backend CORS includes `http://localhost:5173`

### After deployment, API calls fail

- [ ] `VITE_API_URL` updated in Vercel environment
- [ ] Render backend URL added to CORS origins
- [ ] Render backend actually running (check Render dashboard)

### MongoDB connection fails

- [ ] Local: Ensure MongoDB is running
- [ ] Atlas: Verify connection string in `.env`
- [ ] Atlas: Check IP whitelist includes your IP

---

## Testing Commands

```bash
# Backend health check
curl http://localhost:5000/api/auth/get-me

# Frontend build test
cd Frontend/vite-project
npm run build
npm run preview

# Check if ports are in use
lsof -i :5000    # Backend
lsof -i :5173    # Frontend
```

---

## Success Indicators ✅

You'll know everything is working when:

1. ✅ Both servers start without errors
2. ✅ Frontend loads at `http://localhost:5173`
3. ✅ Can register/login successfully
4. ✅ Error messages display as text on page
5. ✅ Can create interview plans
6. ✅ Logout button works and redirects
7. ✅ API calls work across localhost domains

---

**You're all set! Happy developing! 🚀**
