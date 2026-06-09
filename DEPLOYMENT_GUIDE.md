# Local Development Setup

## Prerequisites

- Node.js (v18+) and npm installed
- MongoDB running locally OR MongoDB Atlas connection string

## Backend Setup

1. Navigate to the Backend folder:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example` or `.env.local`):

   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ai-interview-prep
   JWT_SECRET=your_jwt_secret_key_for_local_development
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the Frontend folder:

   ```bash
   cd Frontend/vite-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. The `.env.local` file is already configured for local development:

   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Running Both Locally

### Option 1: Two Terminal Windows

- Terminal 1: `cd Backend && npm run dev`
- Terminal 2: `cd Frontend/vite-project && npm run dev`

### Option 2: Using PM2 (Process Manager)

```bash
npm install -g pm2

# From project root
pm2 start "cd Backend && npm run dev" --name "api"
pm2 start "cd Frontend/vite-project && npm run dev" --name "frontend"

# View logs
pm2 logs

# Stop all
pm2 stop all
```

---

## Deployment to Render (Backend)

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - Build command: `npm install`
   - Start command: `node server.js`
   - Environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your secure JWT secret
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Vercel frontend URL

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
