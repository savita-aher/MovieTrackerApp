import express from "express";
import { users } from "../data/users.mjs";

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
router
  .route("/")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    const { name, username, email } = req.body;

    if (name && username && email) {
      if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({ err: "Username taken" });
      }

      const user = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        username,
        email,
      };
      users.push(user);
      res.json(user);
    } else {
      res.status(400).json({ msg: "Insufficient Data" });
    }
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    user ? res.json(user) : next();
  })
  .patch((req, res, next) => {
    const id = req.params.id;
    const data = req.body;

    const user = users.find((u, i) => {
      if (u.id == id) {
        for (const key in data) {
          users[i][key] = data[key];
        }
        return true;
      }
    });

    user ? res.json(users) : next();
  })
  .delete((req, res, next) => {
    const id = req.params.id;
    const user = users.find((u, i) => {
      if (u.id == id) {
        users.splice(i, 1);
        return true;
      }
    });

    user ? res.json(users) : next();
  });

export default router;