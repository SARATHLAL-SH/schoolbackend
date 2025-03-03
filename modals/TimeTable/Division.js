const sequelize = require("../../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const Division = sequelize.define("Division", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });
  
  module.exports = Division;
  