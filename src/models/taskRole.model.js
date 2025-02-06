const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TaskRole = sequelize.define("TaskRole", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = TaskRole;
