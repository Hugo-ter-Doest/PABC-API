const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FunctionalRoleDomain = sequelize.define("FunctionalRoleDomain", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  FunctionalRoleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  DomainId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = FunctionalRoleDomain;
