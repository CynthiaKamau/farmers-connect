const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../models/Role");
const User = require("../models/User");
const Farmer = require("../models/Farmer");

const router = express.Router();

// Register Farmer
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      farmName,
      farmLocation,
      farmLatitude,
      farmLongitude,
      farmSize,
      cropsPlanted,
      password,
      roleId,
      termsAccepted,
    } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "firstName, lastName, email, password are required" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    // Determine roleId: use provided roleId or default to farmer
    let finalRoleId = roleId;
    let roleName = "";

    if (!finalRoleId) {
      // No roleId provided, default to Farmer role
      const farmerRole = await Role.findOne({ where: { name: "Farmer" } });
      if (!farmerRole)
        return res
          .status(500)
          .json({ message: "Farmer role not found. Run seed." });
      finalRoleId = farmerRole.id;
      roleName = farmerRole.name;
    } else {
      // Validate that the provided roleId exists
      const role = await Role.findByPk(finalRoleId);
      if (!role) return res.status(400).json({ message: "Invalid roleId" });
      roleName = role.name;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      roleId: finalRoleId,
      termsAccepted: termsAccepted || false,
    });

    // Only create Farmer record if role is Farmer
    if (roleName === "Farmer") {
      await Farmer.create({
        userId: user.id,
        farmName: farmName || null,
        farmLocation: farmLocation || null,
        farmLatitude: farmLatitude || null,
        farmLongitude: farmLongitude || null,
        farmSize: farmSize || null,
        cropsPlanted: Array.isArray(cropsPlanted)
          ? cropsPlanted
          : cropsPlanted
          ? [cropsPlanted]
          : [],
        registrationStatus: "pending",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: roleName },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );
    res.status(201).json({ message: "Registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login (Farmer or Admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required" });
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "role" },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const roleName = user.role?.name || "farmer";
    const token = jwt.sign(
      { id: user.id, role: roleName },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );
    res.json({ token, role: roleName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
