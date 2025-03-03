const express = require("express");
const router = express.Router();
const EmpAttendance = require("../../../modals/EmpAttendance");
const Employee = require("../../../modals/Employee");
const refreshAccessToken = require("../../../middlewares/refreshAccessToken");

router.post("/addEmpAttendance", refreshAccessToken, async (req, res) => {
  const { id, date, status } = req.body;

  if (!id || !date || !status) {
    return res.status(400).json({ message: "id, date, and status are required." });
  }

  try {
    // Find employee by id
    const employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const EmployeeId = employee.id;
    const formattedDate = new Date(date);

    // Check if attendance already exists for the given employee and date
    const attendanceRecord = await EmpAttendance.findOne({
      where: { EmployeeId, date: formattedDate },
    });

    if (attendanceRecord) {
      // Update existing attendance record
      attendanceRecord.status = status;
      await attendanceRecord.save();
      return res.status(200).json({
        message: "Attendance updated successfully.",
        attendanceRecord,
      });
    } else {
      // Create a new attendance record
      const newAttendance = await EmpAttendance.create({
        EmployeeId,
        date: formattedDate,
        status,
      });
      return res.status(201).json({
        message: "Attendance created successfully.",
        newAttendance,
      });
    }
  } catch (error) {
    console.error("Error handling EmpAttendance:", error);
    return res.status(500).json({ message: "An error occurred while processing the request.",error });
  }
});

module.exports = router;
