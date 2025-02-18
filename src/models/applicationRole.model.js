const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const ApplicationRole = sequelize.define("ApplicationRole", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  application: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false  
  },
})

module.exports = ApplicationRole
