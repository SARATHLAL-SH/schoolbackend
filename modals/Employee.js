const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const Employee = sequelize.define(
  "Employee",
  {
    name: { type: DataTypes.STRING(45), allowNull: false },
    gender: { type: DataTypes.STRING(45), allowNull: false },
    dateofBirth: { type: DataTypes.DATEONLY, allowNull: false },
    photo: { type: DataTypes.STRING(2083) },
    fatherName: { type: DataTypes.STRING(45) },
    Email: { type: DataTypes.STRING(45) },
    Phone: { type: DataTypes.STRING(45) },
    AltPhone: { type: DataTypes.STRING(45) },
    religion: { type: DataTypes.STRING(45) },
    homeAddress: { type: DataTypes.STRING(45) },
    EmployeeId: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true,
    },
    qualification: { type: DataTypes.STRING(45) },
    designation: { type: DataTypes.STRING(45) },
    department: { type: DataTypes.STRING(45) },
    salary: { type: DataTypes.INTEGER(45) },
    bankName: { type: DataTypes.STRING(45) },
    accountNo: { type: DataTypes.BIGINT(45) },
    ifscCode: { type: DataTypes.STRING(45) },
    panCard: { type: DataTypes.STRING(45) },
    aadharCard: { type: DataTypes.BIGINT(45) },
    workingDays: { type: DataTypes.INTEGER(45) },
    leaveDays: { type: DataTypes.INTEGER(45) },
    campus: { type: DataTypes.STRING(45) },
    joiningDate: { type: DataTypes.DATEONLY, allowNull: false },
    transportRoute: { type: DataTypes.STRING(45) },
    createSmsAlert: { type: DataTypes.STRING(45) },
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
    tableName: "employeedetails",
    timestamps: true, // Disable default timestamps
  }
);


Employee.beforeCreate(async (employee) => {
    const count = await Employee.count(); // Count existing employees
    employee.EmployeeId = `E${String(count + 1).padStart(4, "0")}`; // Generate ID like 'E0001'
  });

  module.exports = Employee;