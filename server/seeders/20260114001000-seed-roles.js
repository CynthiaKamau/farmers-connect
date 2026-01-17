"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Check if roles already exist
    const [existingRoles] = await queryInterface.sequelize.query(
      "SELECT name FROM roles WHERE name IN ('Admin', 'Farmer')"
    );

    const existingNames = existingRoles.map((r) => r.name);
    const rolesToInsert = [];

    if (!existingNames.includes("Admin")) {
      rolesToInsert.push({
        id: Sequelize.literal("(UUID())"),
        name: "Admin",
        description: "admin role",
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!existingNames.includes("Farmer")) {
      rolesToInsert.push({
        id: Sequelize.literal("(UUID())"),
        name: "Farmer",
        description: "farmer role",
        createdAt: now,
        updatedAt: now,
      });
    }

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert("roles", rolesToInsert, {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", { name: ["Admin", "Farmer"] }, {});
  },
};
