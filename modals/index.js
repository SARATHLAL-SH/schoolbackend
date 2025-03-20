const Employee = require("./Employee");
const EmpAttendance = require("./EmpAttendance");
const FeeTable = require("./FeeTable");
const Student = require("./Student");
const Course = require("./courseModal/Course");
const Syllabus = require("./courseModal/Syllabus");

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

  Course.hasMany(Syllabus, {
    foreignKey: "courseId",
    as: "courseSyllabus",
  });

  Syllabus.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
  });

};

module.exports = {
  Employee,
  EmpAttendance,
  FeeTable,
  Student,
  setupAssociations,
  Course,
  Syllabus
};
