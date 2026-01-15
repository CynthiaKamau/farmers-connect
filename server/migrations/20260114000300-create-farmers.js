"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("farmers", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      farmName: { type: Sequelize.STRING(150) },
      farmLocation: { type: Sequelize.STRING(200) },
      registrationStatus: {
        type: Sequelize.ENUM("pending", "certified", "declined"),
        allowNull: false,
        defaultValue: "pending",
      },
      farmSize: { type: Sequelize.STRING(50) },
      cropsPlanted: { type: Sequelize.JSON },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("farmers");
  },
};
