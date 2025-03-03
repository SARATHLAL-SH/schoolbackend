const express = require("express");
const router = express.Router();
const refreshAccessToken = require("../../middlewares/refreshAccessToken");
const Employee = require("../../modals/Employee");

// Route to update an employee

router.put(
  "/update_employee/:employeeId",
  refreshAccessToken,
  async (req, res) => {
    const { employeeId } = req.params; // Extract EmployeeId from URL parameters
    const updatedData = req.body; // Data to update (passed in request body)

    try {
      // Find the employee by employeeId (assuming it's a unique column)
      const employee = await Employee.findOne({ where: { employeeId } });

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" }); // Return 404 if not found
      }

      // Update employee details
      await employee.update(updatedData);

      res
        .status(200)
        .json({ message: "Employee details updated successfully", employee });
    } catch (err) {
      console.error("Error updating employee:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
