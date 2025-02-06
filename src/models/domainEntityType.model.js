const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DomainEntityType = sequelize.define("DomainEntityType", {
  domainId: { type: DataTypes.UUID, allowNull: false },
  entityTypeId: { type: DataTypes.UUID, allowNull: false },
}, { timestamps: false });

module.exports = DomainEntityType;
