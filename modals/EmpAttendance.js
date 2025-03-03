const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const EmpAttendance = sequelize.define(
  "EmpAttendance",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeId: {
      // Foreign key referencing Student
      type: DataTypes.INTEGER,
      references: {
        model: "employeedetails",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    totalAbsents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for total absents
    },
    totalSalary: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0, // Default value for total salary
    },
    
  },
  {
    tableName: "EmpAttendanceTable",
    timestamps: true, // Disable default timestamps
  }
);

// EmpAttendance.beforeCreate(async (attendance, options) => {
//   await updateAbsentsAndSalary(attendance);
// });

// EmpAttendance.beforeUpdate(async (attendance, options) => {
//   await updateAbsentsAndSalary(attendance);
// });

// // Helper function to update totalAbsents and totalSalary
// async function updateAbsentsAndSalary(attendance) {
//   const Employee = sequelize.models.Employee; // Assuming you have an Employee model
//   const employee = await Employee.findByPk(attendance.EmployeeId);

//   if (!employee) {
//     throw new Error("Employee not found");
//   }

//   // Validate employee.totalSalary
//   if (typeof employee.totalSalary !== "number" || isNaN(employee.totalSalary)) {
//     throw new Error("Invalid employee totalSalary");
//   }

//   // Get the current month's attendance records for the employee
//   const startOfMonth = new Date(attendance.date.getFullYear(), attendance.date.getMonth(), 1);
//   const endOfMonth = new Date(attendance.date.getFullYear(), attendance.date.getMonth() + 1, 0);

//   const attendanceRecords = await EmpAttendance.findAll({
//     where: {
//       EmployeeId: attendance.EmployeeId,
//       date: {
//         [Sequelize.Op.between]: [startOfMonth, endOfMonth],
//       },
//     },
//   });

//   // Calculate totalAbsents for the month
//   const totalAbsents = attendanceRecords.filter((record) => record.status === "absent").length;

//   // Calculate totalSalary
//   const dailySalary = employee.totalSalary / 30; // Assuming employee.totalSalary is the monthly salary
//   const totalSalary = employee.totalSalary - totalAbsents * dailySalary;

//   // Validate totalSalary
//   if (isNaN(totalSalary)) {
//     throw new Error("Invalid totalSalary calculation");
//   }

//   // Update the attendance record
//   attendance.totalAbsents = totalAbsents;
//   attendance.totalSalary = totalSalary;

//   // Optionally, update the employee's totalAbsents and totalSalary in the Employee table
//   employee.totalAbsents = totalAbsents;
//   employee.totalSalary = totalSalary;
//   await employee.save();
// }

module.exports = EmpAttendance;
