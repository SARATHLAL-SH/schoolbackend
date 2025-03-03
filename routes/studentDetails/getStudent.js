const express = require("express");
const router = express.Router();
const sequelize = require("../../sequelize");
const Student = require("../../modals/Student");
const Attendance = require("../../modals/Attendance");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");
const { generatePresignedUrl } = require("../../routes/UploadBucket/s3Utils");

//Route to get all students
router.get("/get_student", refreshAccessToken, async (req, res) => {
  try {
    const students = await Student.findAll({
      include:[{
        model:Attendance,
        as: 'attendances'
      }]
    });

    const employeesWithImageUrls = await Promise.all(
      students.map(async (student) => {
        const imageUrl = await generatePresignedUrl(student.photo || "66925640c4a9c61a716cc8fd_Products/user.jpg");
        return {
          ...student.dataValues,
          imageUrl,
        };
      })
    );

    res.status(200).json(employeesWithImageUrls);
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
