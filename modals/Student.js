const sequelize = require("../sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./User");
const FeeTable = require("./FeeTable");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    applicationNumber: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true,
    },
    adhaarCard: { type: DataTypes.BIGINT, allowNull: false },
    admitCard: { type: DataTypes.STRING(2083) },
    birthCertificate: { type: DataTypes.STRING(2083) },
    castCertificate: { type: DataTypes.STRING(2083) },
    name: { type: DataTypes.STRING(45), allowNull: false },
    gender: { type: DataTypes.STRING(45), allowNull: false },
    dateofBirth: { type: DataTypes.DATEONLY, allowNull: false },
    photo: { type: DataTypes.STRING(2083) },
    fatherName: { type: DataTypes.STRING(45) },
    fatherEmail: { type: DataTypes.STRING(45) },
    fatherPhone: { type: DataTypes.STRING(45) },
    whatsappNumber: { type: DataTypes.INTEGER },
    motherName: { type: DataTypes.STRING(45) },
    motherPhone: { type: DataTypes.STRING(45) },
    religion: { type: DataTypes.STRING(45) },
    homeAddress: { type: DataTypes.STRING(45) },
    studentCode: { type: DataTypes.STRING(45), allowNull: true },
    class: { type: DataTypes.STRING(45) },
    section: { type: DataTypes.STRING(45) },
    previousSchool: { type: DataTypes.STRING(45) },
    admissionDate: { type: DataTypes.DATEONLY, allowNull: false },
    monthlyFee: { type: DataTypes.FLOAT },
    discountedStudent: { type: DataTypes.STRING(45) },
    transportRoute: { type: DataTypes.STRING(45) },
    createSmsAlert: { type: DataTypes.STRING(45) },
    
    parentSignature: { type: DataTypes.STRING(2083) },
    studentSignature: { type: DataTypes.STRING(2083) },
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
    tableName: "studentdetails",
    timestamps: true, // Disable default timestamps
  }
);

Student.associate = (models) => {
  Student.hasMany(models.Attendance, {
    foreignKey: "studentId",
    as: "attendances",
  });
  // Student.belongsTo(models.User, {
  //   foreignKey: "fatherEmail", // Foreign key in the Student table
  //   targetKey: "email", // Key in the User table
  //   as: "user", // Alias for the association
  // });
};
Student.beforeCreate(async (student) => {
  const lastStudent = await Student.findOne({
    order: [["studentCode", "DESC"]], // Get the last student by studentCode
  });

  const lastCode = lastStudent ? parseInt(lastStudent.studentCode) : 0;
  student.studentCode = String(lastCode + 1).padStart(4, "0"); // Ensure 4-digit format

  const lastAppNumber =
    lastStudent && lastStudent.applicationNumber
      ? parseInt(lastStudent.applicationNumber.split("-")[1])
      : 0;

  const newAppNumber = `APP-${String(lastAppNumber + 1).padStart(4, "0")}`;
  student.applicationNumber = newAppNumber;
});

module.exports = Student;
