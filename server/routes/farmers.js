const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Farmer = require("../models/Farmer");

const router = express.Router();

// Current farmer status
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ where: { userId: req.user.id } });
    if (!farmer)
      return res.status(404).json({ message: "Farmer record not found" });
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
