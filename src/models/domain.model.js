const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Domain = sequelize.define("Domain", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = Domain;
