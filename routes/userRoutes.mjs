import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

// GET Login Page
router.get("/", (req, res) => {
  res.render("login", { error: null });
});

// POST Login Handler
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userPath = path.join(process.cwd(), "data", "users.json");

  try {
    const data = await fs.readFile(userPath, "utf-8");
    const users = JSON.parse(data);
    const match = users.find(user => user.username === username && user.password === password);

    if (match) {
      res.redirect("/add-movie?auth=true");
    } else {
      res.render("login", { error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ Error reading user data:", err.message);
    res.status(500).send("Login error");
  }
});

export default router;