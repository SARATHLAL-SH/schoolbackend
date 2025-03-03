const express = require("express");
const router = express.Router();
const Attendance = require("../../modals/Attendance");
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");
const { generatePresignedUrl } = require("../../routes/UploadBucket/s3Utils");

router.get("/getAllAttendance", refreshAccessToken, async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Attendance,
          as: "attendances",
        },
      ],
    });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    const employeesWithImageUrls = await Promise.all(
      students.map(async (student) => {
        const imageUrl = await generatePresignedUrl(
          student.photo || "66925640c4a9c61a716cc8fd_Products/user.jpg"
        );
        return {
          ...student.dataValues,
          imageUrl,
        };
      })
    );
    return res.status(200).json(employeesWithImageUrls);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

