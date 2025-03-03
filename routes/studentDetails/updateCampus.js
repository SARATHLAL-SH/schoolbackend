const express = require("express");
const router = express.Router();
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.put(
    "/update_campus/:studentCode",
    refreshAccessToken,
    async (req, res) => {
      const { studentCode } = req.params;
      const { campus,studentClass } = req.body; // Assuming the new campus is passed in the request body
  
      if (!campus) {
        return res.status(400).json({ error: "Campus is required" });
      }
  
      try {
        const student = await Student.findOne({
          where: {
            studentCode: studentCode,
          },
        });
  
        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }
  
        // Update the campus field
        student.campus = campus;
        student.class = studentClass;
  
        // Save the updated student data
        await student.save();
  
        res.status(200).json({ message: "Campus updated successfully", student });
      } catch (err) {
        console.error("Error updating campus:", err.message);
        res.status(400).json({ error: err.message });
      }
    }
  );
  
  module.exports = router;
  