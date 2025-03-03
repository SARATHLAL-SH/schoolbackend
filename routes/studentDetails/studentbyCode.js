const express = require("express");
const router = express.Router();
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

//Route to get a specific student by studentCode
router.get(
  "/get_student/:studentCode",
  refreshAccessToken,
  async (req, res) => {
    const { studentCode } = req.params;
    try {
      const student = await Student.findOne({
        where: {
          studentCode: studentCode,
        },
      });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(student);
    } catch (err) {
      console.error("Error fetching student:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
