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
    field: "divisionId",
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

// Explicitly specify foreign key names in associations
Timetable.belongsTo(Class, { foreignKey: "classId" });
Timetable.belongsTo(Division, { foreignKey: "divisionId" });
Timetable.belongsTo(TimePeriod, { foreignKey: "timePeriodId" });
Timetable.belongsTo(Subject, { foreignKey: "subjectId" });

module.exports = Timetable;
