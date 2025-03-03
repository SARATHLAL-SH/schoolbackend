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
    name: { type: DataTypes.STRING(45), allowNull: false },
    gender: { type: DataTypes.STRING(45), allowNull: false },
    dateofBirth: { type: DataTypes.DATEONLY, allowNull: false },
    photo: { type: DataTypes.STRING(2083) },
    fatherName: { type: DataTypes.STRING(45) },
    fatherEmail: { type: DataTypes.STRING(45) },
    fatherPhone: { type: DataTypes.STRING(45) },
    motherPhone: { type: DataTypes.STRING(45) },
    religion: { type: DataTypes.STRING(45) },
    homeAddress: { type: DataTypes.STRING(45) },
    studentCode: { type: DataTypes.STRING(45), allowNull: true },
    campus: { type: DataTypes.STRING(45) },
    class: { type: DataTypes.STRING(45) },
    section: { type: DataTypes.STRING(45) },
    previousSchool: { type: DataTypes.STRING(45) },
    admissionDate: { type: DataTypes.DATEONLY, allowNull: false },
    monthlyFee: { type: DataTypes.FLOAT },
    discountedStudent: { type: DataTypes.STRING(45) },
    transportRoute: { type: DataTypes.STRING(45) },
    createSmsAlert: { type: DataTypes.STRING(45) },
    parentAccount: { type: DataTypes.STRING(45) },
    generateAdmissionFee: { type: DataTypes.STRING(45) },
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
  Student.belongsTo(models.User, {
    foreignKey: "fatherEmail", // Foreign key in the Student table
    targetKey: "email", // Key in the User table
    as: "user", // Alias for the association
  });
};

Student.beforeCreate(async (studnet) => {
  const count = await Student.count(); // Count existing employees
  studnet.studentCode = `${String(count + 1).padStart(4, "0")}`; // Generate ID like '0001'
});

module.exports = Student;
