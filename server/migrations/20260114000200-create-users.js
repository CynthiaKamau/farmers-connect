"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: { type: Sequelize.STRING(50), allowNull: false },
      lastName: { type: Sequelize.STRING(50), allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      phoneNumber: { type: Sequelize.STRING(30) },
      password: { type: Sequelize.STRING(120), allowNull: false },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "roles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
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
    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "users_email_unique",
    });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex("users", "users_email_unique");
    await queryInterface.dropTable("users");
  },
};
