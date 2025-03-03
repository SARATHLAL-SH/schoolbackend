const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      // Foreign key referencing Student
      type: DataTypes.INTEGER,
      references: {
        model: "studentdetails",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    studentCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "present",
        "absent",
        "late",
        "undefined",
        "half day",
        "sunday",
        "holiday",
        "Onleave"
      ),
      allowNull: false,
      defaultValue: "undefined",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Auto-update on modification
    },
  },
  {
    tableName: "attendanceTable",
    timestamps: true, // Disable default timestamps
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["studentId", "date"], // Enforce unique attendance for each student per day
    //   },
    // ],
  }
);

Attendance.associate = (models) => {
  Attendance.belongsTo(models.Student, {
    foreignKey: "studentId",
    as: "student",
  });
};

module.exports = Attendance;
