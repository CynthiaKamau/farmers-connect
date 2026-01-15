"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("farmers", "farmLatitude", {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
    await queryInterface.addColumn("farmers", "farmLongitude", {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("farmers", "farmLatitude");
    await queryInterface.removeColumn("farmers", "farmLongitude");
  },
};
