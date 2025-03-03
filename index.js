const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./sequelize");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
app.use(cors());
const server = http.createServer(app);
// const Student = require("./modals/Student");
const Attendance = require("./modals/Attendance");
const User = require("./modals/User");
// const FeeTable = require("./modals");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const uploadeFile = require("./routes/uploadFile/uploadFile");
const uploadBucket = require("./routes/UploadBucket/uploadtoBucket");
const signupRoutes = require("./routes/Auth/signup");
const loginRoutes = require("./routes/Auth/login");
const createStudent = require("./routes/studentDetails/addStudent");
const getStudents = require("./routes/studentDetails/getStudent");
const studentByCode = require("./routes/studentDetails/studentbyCode");
const updateCampus = require("./routes/studentDetails/updateCampus");
const promoteStudents = require("./routes/studentDetails/promoteStudents");
const getAllAttendance = require("./routes/AttendanceDetails/getAttendance");
const getChildbyMail = require("./routes/ParentsWithChildren/getChildbyMail");
const resetPassword = require("./routes/Auth/resetPassoword");
const {
  getEmployeeRoutes,
  addEmployeeRoutes,
  updateEmployeeRoutes,
  updateEmployeePhoto,
} = require("./routes/EmployeeDetails");
const chatwithTeacher = require("./routes/SendMessages/chatRoute");
const attendanceRegister = require("./routes/AttendanceDetails/attendanceRegister");
const getdailyAttendance = require("./routes/AttendanceDetails/getAttendancebyDate");
const getUsers = require("./routes/Auth/getAllUsers");
const deleteUser = require("./routes/Auth/deleteUser");
const sendNotification = require("./routes/Notification/sendNotification");
const sendSubscription = require("./routes/Notification/sendSubscription");
const whatsappRoutes = require("./routes/whatsappchat/whatsappRoutes");
const bulkAttendance = require("./routes/AttendanceDetails/bulkAttendance");
const addEmpAttendance = require("./routes/AttendanceDetails/EmployeeAttendance/EmpAttendanceRegister");
const {
  setupAssociations,
  Student,
  EmpAttendance,
  FeeTable,
} = require("./modals");
const getEmpAttendanceByDate = require("./routes/AttendanceDetails/EmployeeAttendance/getEmpAttendancebyDate");
const timeTableModule = require("./routes/TimeTable/timeTable");
const timeTableEntry = require("./routes/TimeTable/timetableEntry");
const fetchTimeTable = require("./routes/TimeTable/fetchTimeTable");
const updateTimetable = require("./routes/TimeTable/updateTimeTable");
const feeRoutes = require("./routes/FeeTable/FeesTable");
const generateMonthlyFees = require("./routes/FeeTable/generateMonthlyFees");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());

// Run every 1st of the month at 00:00 AM
cron.schedule("0 0 1 * *", () => {
  console.log("Generating monthly fees...");
  generateMonthlyFees();
});

app.use("/auth", signupRoutes);
app.use("/auth", loginRoutes);
app.use("/", createStudent);
app.use("/", getStudents);
app.use("/", studentByCode);
app.use("/", updateCampus);
app.use("/", promoteStudents);
app.use("/", uploadeFile);
app.use("/", addEmployeeRoutes);
app.use("/", getEmployeeRoutes);
app.use("/", updateEmployeeRoutes);
app.use("/", updateEmployeePhoto);
app.use("/", uploadBucket);
app.use("/", chatwithTeacher);
app.use("/", attendanceRegister);
app.use("/", getAllAttendance);
app.use("/", getChildbyMail);
app.use("/", getdailyAttendance);
app.use("/", resetPassword);
app.use("/", deleteUser);
app.use("/", getUsers);
app.use("/", sendNotification);
app.use("/", sendSubscription);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/", bulkAttendance);
app.use("/", addEmpAttendance);
app.use("/", getEmpAttendanceByDate);
app.use("/", timeTableModule);
app.use("/", timeTableEntry);
app.use("/", fetchTimeTable);
app.use("/", updateTimetable);
app.use("/", feeRoutes);

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // Join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("type of roomid", typeof roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle message sending
  socket.on("send_message", ({ roomId, message, userId }) => {
    console.log("send meesage", message);

    io.to(roomId).emit("receive_message", { roomId, message, userId });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const db = {
  sequelize,
  Sequelize,
  Student,
  Attendance,
  User,
  FeeTable,
  setupAssociations,
};
// Student.associate(db);
Attendance.associate(db);
User.associate(db);
Student.associate(db);
setupAssociations();
sequelize
  .sync({ alter: false }) // Alter tables to match the model if they already exist
  .then(() => {
    console.log("Database synced successfully.");
    server.listen(8081, "0.0.0.0", () => {
      console.log("Server is running on port 8081");
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
