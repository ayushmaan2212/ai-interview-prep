require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Connect to database and start server
async function startServer() {
  try {
    console.log(`📍 PORT from env: ${process.env.PORT}`);
    console.log(`🚀 Starting server on port ${PORT}...`);

    await connectToDB();
    console.log("✅ Connected to database");

    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Access at: http://localhost:${PORT}`);
    });

    // Error handler
    server.on("error", (err) => {
      console.error("❌ Server error:", err);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
