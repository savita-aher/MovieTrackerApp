// Imports
import express from "express";
import fs from "fs/promises";
import path from "path";
import movieRoutes from "./routes/movieRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";

// App Setup
const app = express();
const PORT = 3000;

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve CSS and assets

// Logging Middleware
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

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

// View Routes
app.get("/add-movie", (req, res) => {
  res.render("movieForm", { title: "Add a New Movie" });
});

app.get("/movies", async (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), "data", "movies.json");
    const data = await fs.readFile(dataPath, "utf-8");
    const movies = JSON.parse(data);
    res.render("movies", { title: "All Movies", movies });
  } catch (err) {
    console.error("❌ Failed to load movies:", err.message);
    res.status(500).send("Error loading movie list");
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("🎬 Welcome to the Movie Tracker API");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).send("Internal Server Error");
});

// Server Listener
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});