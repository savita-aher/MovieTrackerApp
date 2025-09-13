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
  console.log(`${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/", userRoutes);


const dataPath = path.join(process.cwd(), "data", "movies.json");
app.get("/api/movies", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const movies = JSON.parse(data);
    res.json(movies);
  } catch (err) {
    console.error("Error reading movies:", err.message);
    res.status(500).json({ error: "Failed to load movies" });
  }
});


//  Add Movie Route
app.get("/add-movie", (req, res) => {
  if (req.query.auth === "true") {
    res.render("movieForm", { title: "Add a New Movie" });
  } else {
    res.redirect("/");
  }
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



// Root Route → Login Page
app.get("/", (req, res) => {
  res.render("login", { error: null });
});

// Login Handler → Redirect with Auth Flag
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //This line calls an asynchronous function named readUsers()
  const users = await readUsers(); 

  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.render("login", { error: "Invalid credentials" });
  }

  // ✅ No error passed here
  res.redirect("/add-movie?auth=true");
});


// message Handler → Redirect with message movie added
app.get("/success", (req, res) => {
  res.render("success", { message: "Movie added successfully!" });
});

// message Handler → Redirect with message movie deleted
app.get("/delete", (req, res) => {
  try {
    res.render("delete", { message: "Movie deleted successfully!" });
  } catch (err) {
    console.error("Render error:", err);
    res.status(500).send("View rendering failed");
  }
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