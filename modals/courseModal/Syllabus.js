const sequelize = require("../../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const Syllabus = sequelize.define("Syllabus", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = Syllabus;
