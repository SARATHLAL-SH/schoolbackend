const express = require("express");
const router = express.Router();
const Attendance = require("../../modals/Attendance");
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.post("/bulkAttendanceupdate", refreshAccessToken, async (req, res) => {
  const { date, className, section, status } = req.body;

  if (!date || !className || !section || !status) {
    return res
      .status(400)
      .json({ message: "date, className, section, and status are required." });
  }

  try {
    // Find all st/udents in the specified class and section
    const whereClause = { class: className };
    if (section !== "all Section" || section !== "") {
      whereClause.section = section;
    }

    const students = await Student.findAll({
      where: whereClause,
    });

    if (!students || students.length === 0) {
      return res.status(404).json({
        message: "No students found for the given class and section.",
      });
    }

    const formattedDate = new Date(date);

    // Update or create attendance records for each student
    const updatePromises = students.map(async (student) => {
      const attendanceRecord = await Attendance.findOne({
        where: {
          studentId: student.id,
          date: formattedDate,
        },
      });

      if (attendanceRecord) {
        // Update the status if the record exists
        attendanceRecord.status = status;
        await attendanceRecord.save();
      } else {
        // Create a new attendance record if it doesn't exist
        await Attendance.create({
          studentId: student.id,
          studentCode: student.studentCode,
          date: formattedDate,
          status,
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ message: "Attendance updated successfully." });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
});

module.exports = router;
