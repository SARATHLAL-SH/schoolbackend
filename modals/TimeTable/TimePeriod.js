const sequelize = require("../../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const TimePeriod = sequelize.define("TimePeriod", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
});

module.exports = TimePeriod;
