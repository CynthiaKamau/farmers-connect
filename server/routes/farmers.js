const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const Farmer = require("../models/Farmer");
const User = require("../models/User");

const router = express.Router();

// Current farmer status
router.get("/profile", authMiddleware, async (req, res) => {
  console.log("Farmer profile request for user ID:", req.user);
  try {
    const farmer = await Farmer.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
        },
      ],
    });
    if (!farmer)
      return res.status(404).json({ message: "Farmer record not found" });
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
