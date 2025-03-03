const express = require("express");
const router = express.Router();
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.put(
  "/promote_students",
  refreshAccessToken, // Middleware for access token validation
  async (req, res) => {
    const { fromClass, fromSection, toClass, toSection } = req.body;

    // Validate the input
    if (!fromClass || !fromSection || !toClass || !toSection) {
      return res.status(400).json({
        error: "fromClass, fromSection, toClass, and toSection are required",
      });
    }

    try {
      // Find all students in the specified class and section
      const studentsToPromote = await Student.findAll({
        where: {
          class: fromClass,
          section: fromSection,
        },
      });

      if (!studentsToPromote || studentsToPromote.length === 0) {
        return res.status(404).json({
          error: "No students found in the selected class and section",
        });
      }

      // Update the class and section for all retrieved students
      const updatedStudents = await Promise.all(
        studentsToPromote.map(async (student) => {
          student.class = toClass;
          student.section = toSection;
          return await student.save(); // Save updated data to the database
        })
      );

      res.status(200).json({
        message: "Students promoted successfully",
        updatedStudents,
      });
    } catch (err) {
      console.error("Error promoting students:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
