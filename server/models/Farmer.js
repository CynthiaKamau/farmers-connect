const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const Farmer = sequelize.define(
  "Farmer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    farmName: { type: DataTypes.STRING(150) },
    farmLocation: { type: DataTypes.STRING(200) },
    registrationStatus: {
      type: DataTypes.ENUM("pending", "certified", "declined"),
      defaultValue: "pending",
    },
    farmSize: { type: DataTypes.STRING(50) },
    cropsPlanted: { type: DataTypes.JSON },
  },
  {
    tableName: "farmers",
    timestamps: true,
  }
);

Farmer.belongsTo(User, {
  as: "user",
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
User.hasOne(Farmer, { as: "farmer", foreignKey: "userId" });

module.exports = Farmer;
