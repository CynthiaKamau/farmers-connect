const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const Farmer = require("../models/Farmer");
const User = require("../models/User");
const { Sequelize } = require("sequelize");

const router = express.Router();

// Get farmer statistics (counts by status)
router.get("/farmers/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const total = await Farmer.count();
    const pending = await Farmer.count({
      where: { registrationStatus: "pending" },
    });
    const certified = await Farmer.count({
      where: { registrationStatus: "certified" },
    });
    const declined = await Farmer.count({
      where: { registrationStatus: "declined" },
    });

    res.json({
      total,
      pending,
      certified,
      declined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List all farmers
router.get("/farmers", authMiddleware, adminOnly, async (req, res) => {
  try {
    const farmers = await Farmer.findAll({
      include: {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
      },
    });
    res.json(farmers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update status
router.post(
  "/farmers/:id/status",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body; // pending, certified, declined
      const { id } = req.params;
      if (!["pending", "certified", "declined"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const farmer = await Farmer.findByPk(id);
      if (!farmer) return res.status(404).json({ message: "Farmer not found" });
      farmer.registrationStatus = status;
      await farmer.save();
      res.json({ message: "Status updated", farmer });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
