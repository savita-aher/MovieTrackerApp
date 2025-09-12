import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/movies.json");

// Helpers
const readMovies = () => JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const writeMovies = (movies) =>
  fs.writeFileSync(dataPath, JSON.stringify(movies, null, 2));

router.get("/add-movie", (req, res) => {
  res.render("movieForm", { title: "Add a New Movie" });
});


// @route   POST /api/movies
router.post("/", (req, res) => {
  const { title, genre, description } = req.body;

  if (title && genre && description) {
    const movies = readMovies();
    const newMovie = {
      id: Date.now().toString(),
      title,
      genre,
      description,
    };
    movies.push(newMovie);
    writeMovies(movies);
    res.redirect("/success");
  } else {
    res.status(400).json({ error: "Missing required fields" });
  }
});

// @route   GET /api/movies/:id
router.get("/:id", (req, res) => {
  const movie = readMovies().find((m) => m.id === req.params.id);
  movie ? res.json(movie) : res.status(404).json({ error: "Movie not found" });
});

// @route   PATCH /api/movies/:id
router.patch("/:id", (req, res) => {
  const movies = readMovies();
  const index = movies.findIndex((m) => m.id === req.params.id);

  if (index !== -1) {
    movies[index] = { ...movies[index], ...req.body };
    writeMovies(movies);
    res.json(movies[index]);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

// @route   DELETE /api/movies/:id
router.delete("/:id", (req, res) => {
  const movies = readMovies();
  const filtered = movies.filter((m) => m.id !== req.params.id);

  if (filtered.length === movies.length) {
    res.status(404).json({ error: "Movie not found" });
  } else {
    writeMovies(filtered);
    res.status(204).send();
  }
});

export default router;