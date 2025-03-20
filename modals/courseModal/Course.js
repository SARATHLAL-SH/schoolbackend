const { DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("package", "monthly"),
      allowNull: false,
    },
    duration: {
      type: DataTypes.ENUM("1 Month","3 Months","6 Months","9 Months","1 Year","1.6 Years","2 Years","3 Years"), // Example: "3 months", "6 weeks"
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    syllabus: {
      type: DataTypes.JSON,  // ✅ Store multiple syllabus entries as JSON
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

module.exports = Course;
