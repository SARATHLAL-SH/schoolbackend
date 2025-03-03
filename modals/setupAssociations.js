const { Student, Attendance, Employee, EmpAttendance, FeeTable } = require("./index");

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

  Student.hasMany(FeeTable, {
    foreignKey: "StudentId",
    as: "feeRecords",
  });

  Student.hasMany(Attendance, {
    foreignKey: "studentId",
    as: "attendances",
  });

  Attendance.belongsTo(Student, {
    foreignKey: "studentId",
    as: "student",
  });
};

module.exports = setupAssociations;
