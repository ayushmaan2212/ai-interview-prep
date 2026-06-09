const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Dynamic CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ai-interview-prep-ecru-phi.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("📋 Allowed CORS origins:", allowedOrigins);

app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

/*  require all the routes */
const authRouter = require("../src/routes/auth.route");
const interviewRouter = require("../src/routes/interview.route");

/*  using all the routes */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
