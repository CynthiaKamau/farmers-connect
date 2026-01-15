const bcrypt = require("bcryptjs");
const { connect, sequelize } = require("../config/database");
const Role = require("../models/Role");
const User = require("../models/User");

async function seed() {
  try {
    await connect();
    await sequelize.sync({ alter: true });

    const roles = ["admin", "farmer"];
    for (const r of roles) {
      const [role] = await Role.findOrCreate({
        where: { name: r },
        defaults: { description: `${r} role` },
      });
    }

    const adminRole = await Role.findOne({ where: { name: "admin" } });
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const adminUser = await User.create({
        name: "Admin",
        email: adminEmail,
        phoneNumber: "",
        passwordHash,
        roleId: adminRole.id,
      });
    } else {
      console.log("Admin already exists:", existingAdmin.email);
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
