const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const Student = require("../modals");
const FeeTable = require("../modals");

const StudentFeeSummary = sequelize.define(
  "StudentFeeSummary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StudentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "studentdetails",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    totalFee: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    feeDue: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    dueMonth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "student_fee_summary",
    timestamps: true,
  }
);

// **Calculate and Set Default Values Before Creating a Record**
StudentFeeSummary.beforeCreate(async (summary) => {
  const student = await Student.findByPk(summary.StudentId);

  if (!student) throw new Error("Student not found!");

  // Get current date
  const currentDate = new Date();
  const admissionDate = new Date(student.admissionDate);
  const monthDiff =
    (currentDate.getFullYear() - admissionDate.getFullYear()) * 12 +
    (currentDate.getMonth() - admissionDate.getMonth()) +
    1;

  // Ensure monthDiff is at least 1 (to handle same-month admission)
  const monthsSinceAdmission = Math.max(monthDiff, 1);

  summary.totalFee = student.monthlyFee * monthsSinceAdmission;
  summary.feeDue = summary.totalFee;
  summary.dueMonth = admissionDate.toLocaleString("default", { month: "long" });
});

// **Update Fee Due & Due Month When Payment is Made**
FeeTable.afterCreate(async (fee) => {
  const summary = await StudentFeeSummary.findOne({
    where: { StudentId: fee.StudentId },
  });

  if (!summary) {
    // Fetch student details
    const student = await Student.findByPk(fee.StudentId);
    if (!student) {
      throw new Error("Student not found!");
    }

    // Calculate the total fee since admission
    const currentDate = new Date();
    const admissionDate = new Date(student.admissionDate);
    const monthDiff =
      (currentDate.getFullYear() - admissionDate.getFullYear()) * 12 +
      (currentDate.getMonth() - admissionDate.getMonth()) +
      1;

    const monthsSinceAdmission = Math.max(monthDiff, 1);

    // Create new summary record
    summary = await StudentFeeSummary.create({
      StudentId: fee.StudentId,
      totalFee: student.monthlyFee * monthsSinceAdmission,
      feeDue: student.monthlyFee * monthsSinceAdmission - fee.total,
      dueMonth: new Date(2024, fee.month - 1, 1).toLocaleString("default", {
        month: "long",
      }),
    });
  } else {
    // Update existing summary
    summary.feeDue -= fee.total;
    summary.dueMonth = new Date(2024, fee.month - 1, 1).toLocaleString(
      "default",
      { month: "long" }
    );
    await summary.save();
  }
});

module.exports = StudentFeeSummary;
