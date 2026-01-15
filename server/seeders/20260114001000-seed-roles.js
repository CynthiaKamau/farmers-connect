"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: Sequelize.literal("(UUID())"),
          name: "Admin",
          description: "admin role",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: Sequelize.literal("(UUID())"),
          name: "Farmer",
          description: "farmer role",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", { name: ["admin", "farmer"] }, {});
  },
};
