const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const EntityType = sequelize.define("EntityType", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = EntityType
