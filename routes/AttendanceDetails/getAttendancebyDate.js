const express = require("express");
const router = express.Router();
const Attendance = require("../../modals/Attendance");
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");
const { generatePresignedUrl } = require("../../routes/UploadBucket/s3Utils");
const { Op } = require("sequelize");

router.get("/getAttendanceByDate", refreshAccessToken, async (req, res) => {
    const { date } = req.query;
    const formattedDate = new Date(date);
  
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
  
    try {
      const students = await Student.findAll({
        include: [
          {
            model: Attendance,
            as: "attendances",
            where: {
                [Op.or]: [
                    { date: formattedDate },                 // Date matches the given date
                    { status: "undefined" },         // Attendance status is "undefined"
                  ],
            },
            required: false,
          },
        ],
      });
  
      if (!students || students.length === 0) {
        return res.status(404).json({ message: "No attendance found for the given date" });
      }
  
      const studentsWithImageUrls = await Promise.all(
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
  
      return res.status(200).json(studentsWithImageUrls);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  module.exports = router;
  