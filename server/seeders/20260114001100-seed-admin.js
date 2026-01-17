"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const [roles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'Admin' LIMIT 1"
    );
    if (!roles.length) {
      throw new Error("Admin role not found. Run role seeder first.");
    }
    const roleId = roles[0].id;

    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email LIMIT 1",
      { replacements: { email: adminEmail } }
    );
    if (users.length) {
      return; // already exists
    }

    const password = await bcrypt.hash(adminPassword, 10);
    const now = new Date();

    // MySQL UUID() for id value
    await queryInterface.sequelize.query(
      `INSERT INTO users (id, firstName, lastName, email, phoneNumber, password, roleId, createdAt, updatedAt)
       VALUES (UUID(), :firstName, :lastName, :email, :phone, :password, :roleId, :createdAt, :updatedAt)`,
      {
        replacements: {
          firstName: "Admin",
          lastName: "User",
          email: adminEmail,
          phone: "",
          password,
          roleId,
          createdAt: now,
          updatedAt: now,
        },
      }
    );
  },

  async down(queryInterface) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    await queryInterface.bulkDelete("users", { email: adminEmail }, {});
  },
};
