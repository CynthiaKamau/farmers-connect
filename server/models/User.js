const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Role = require("./Role");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING(50), allowNull: false },
    lastName: { type: DataTypes.STRING(50), allowNull: false },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phoneNumber: { type: DataTypes.STRING(30) },
    roleId: { type: DataTypes.UUID, allowNull: false },
    password: { type: DataTypes.STRING(120), allowNull: false },
    termsAccepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

User.belongsTo(Role, {
  as: "role",
  foreignKey: { name: "roleId", allowNull: false },
});
Role.hasMany(User, { as: "users", foreignKey: "roleId" });

module.exports = User;
