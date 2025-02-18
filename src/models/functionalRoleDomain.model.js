const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const FunctionalRoleDomain = sequelize.define("FunctionalRoleDomain", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  functionalRoleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  domainId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
})

module.exports = FunctionalRoleDomain
