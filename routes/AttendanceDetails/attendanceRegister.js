const express = require("express");
const router = express.Router();
const Attendance = require("../../modals/Attendance");
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.post("/addAttendance", refreshAccessToken, async (req, res) => {
  const { studentCode, date, status } = req.body;
  if (!studentCode || !date || !status) {
    return res
      .status(400)
      .json({ message: "studentCode, date, and status are required." });
  }

  try {
    // Find student by studentCode
    const student = await Student.findOne({
      where: { studentCode },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const studentId = student.id;
    const formattedDate = new Date(date);
    // Check if attendance already exists for the given student and date
    const attendanceRecord = await Attendance.findOne({
      where: {
        studentCode,
        date: formattedDate,
      },
    });
    if (attendanceRecord) {
      // Update the status if the record exists
      attendanceRecord.status = status;
      await attendanceRecord.save();
      return res.status(200).json({
        message: "Attendance updated successfully.",
        attendanceRecord,
      });
    } else {
      // Create a new attendance record if it doesn't exist
      const newAttendance = await Attendance.create({
        studentId,
        studentCode,
        date,
        status,
      });
      return res
        .status(201)
        .json({ message: "Attendance created successfully.", newAttendance });
    }
  } catch (error) {
    console.error("Error handling attendance:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
});

module.exports = router;
