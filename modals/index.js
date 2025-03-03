const Employee = require("./Employee");
const EmpAttendance = require("./EmpAttendance");
const FeeTable = require("./FeeTable");
const Student = require("./Student");

const setupAssociations = () => {
  Employee.hasMany(EmpAttendance, {
    foreignKey: "EmployeeId",
    as: "empAttendances",
  });

  EmpAttendance.belongsTo(Employee, {
    foreignKey: "EmployeeId",
    as: "employee",
  });

  FeeTable.belongsTo(Student, {
    foreignKey: "StudentId",
    as: "student",
  });

  // In Student model
  Student.hasMany(FeeTable, {
    foreignKey: "StudentId",
    as: "feeRecords",
  });
};

module.exports = {
  Employee,
  EmpAttendance,
  FeeTable,
  Student,
  setupAssociations,
};
