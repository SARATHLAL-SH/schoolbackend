const { Endpoint } = require("aws-sdk");
const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const Subscriptions = sequelize.define(
  "Subscriptions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
},
{
    tableName: "subscriptions",
    timestamps: true, // Disable default timestamps
  }
);

module.exports = Subscriptions;