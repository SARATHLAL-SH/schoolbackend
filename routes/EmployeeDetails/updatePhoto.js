const express = require("express");
const router = express.Router();
const sequelize = require("../../sequelize");
const Employee = require("../../modals/Employee");

// Route to update an employee's photo
router.put("/update_employee_photo", async (req, res) => {
  const { EmployeeId, photo } = req.body;

  if (!EmployeeId || !photo) {
    return res.status(400).json({ error: "EmployeeId and photo URL are required." });
  }

  try {
    // Find the employee by EmployeeId
    const employee = await Employee.findOne({ where: { EmployeeId } });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    // Update the photo field
    employee.photo = photo;
    await employee.save();

    res.status(200).json({ message: "Photo updated successfully.", employee });
  } catch (err) {
    console.error("Error updating employee photo:", err.message);
    res.status(500).json({ error: "An error occurred while updating the photo." });
  }
});

module.exports = router;
