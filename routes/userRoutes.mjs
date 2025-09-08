import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/users.json");

// Helpers
const readUsers = async () => {
  const data = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(data);
};

const writeUsers = async (users) => {
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
};

// @route   GET /api/users
router.get("/", async (req, res) => {
  const users = await readUsers();
  res.json(users);
});

// @route   POST /api/users
router.post("/", async (req, res) => {
  const { username, email } = req.body;

  if (username && email) {
    const users = await readUsers();
    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      email: email.trim()
    };
    users.push(newUser);
    await writeUsers(users);
    res.status(201).json(newUser);
  } else {
    res.status(400).json({ error: "Missing required fields" });
  }
});

// @route   GET /api/users/:id
router.get("/:id", async (req, res) => {
  const users = await readUsers();
  const user = users.find((u) => u.id === req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// @route   PATCH /api/users/:id
router.patch("/:id", async (req, res) => {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === req.params.id);

  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    await writeUsers(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @route   DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  const users = await readUsers();
  const filtered = users.filter((u) => u.id !== req.params.id);

  if (filtered.length === users.length) {
    res.status(404).json({ error: "User not found" });
  } else {
    await writeUsers(filtered);
    res.status(204).send();
  }
});

export default router;