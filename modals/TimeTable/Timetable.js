const sequelize = require("../../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

// Import related models
const Class = require("./Class");
const Division = require("./Division");
const TimePeriod = require("./TimePeriod");
const Subject = require("./Subject");

const Timetable = sequelize.define("Timetable", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  day: {
    type: DataTypes.ENUM(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ),
    allowNull: false,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Class, key: "id" },
  },
  divisionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Division, key: "id" },
  },
  timePeriodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: TimePeriod, key: "id" },
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Subject, key: "id" },
  },
});

Timetable.belongsTo(Class);
Timetable.belongsTo(Division);
Timetable.belongsTo(TimePeriod);
Timetable.belongsTo(Subject);

module.exports = Timetable;
