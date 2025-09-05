// Imports
import express from "express";
import movieRoutes from "./routes/movieRoutes.mjs";

// Setups
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for request tracking
app.use((req, res, next) => {
  const time = new Date();
  console.log(`-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Routes
app.use("/api/movies", movieRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🎬 Welcome to the Movie Tracker API");
});

// Server Listener
app.listen(PORT, () => {
  console.log(`✅ Server running on PORT: ${PORT}`);
});