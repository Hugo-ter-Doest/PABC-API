const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FunctionalRoleTaskRole = sequelize.define("FunctionalRoleTaskRole", {
  functionalRoleId: { type: DataTypes.UUID, allowNull: false },
  taskRoleId: { type: DataTypes.UUID, allowNull: false },
}, { timestamps: false });

module.exports = FunctionalRoleTaskRole;
