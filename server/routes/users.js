const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/User");
const Farmer = require("../models/Farmer");
const Role = require("../models/Role");

const router = express.Router();

// Get all user roles (public - needed for registration)
router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.findAll({ attributes: ["id", "name"] });
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: { association: "role", attributes: ["id", "name"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID (admin can view any user)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: { association: "role", attributes: ["id", "name"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
