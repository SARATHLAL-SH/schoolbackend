const express = require("express");
const multer = require("multer");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
const Student = require("../../modals/Student");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

const upload = multer({ dest: "uploads/" });
router.use(bodyParser.urlencoded({ extended: true }));

router.post(
  "/upload_students",
  refreshAccessToken,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const classSelect = req.body.class;
      const section = req.body.section;
      const parentAccount = req.body.parentAccount;

      if (!classSelect || !section || !parentAccount) {
        return res
          .status(400)
          .json({ error: "Class, Section, or Parent Account is missing" });
      }

      const fileContent = fs
        .readFileSync(filePath, "utf8")
        .replace(/^\uFEFF/, "");
      const lines = fileContent
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "");
      const header = lines[0].split(",");
      const studentsData = lines.slice(1).map((line) => {
        const values = line.split(",");
        return header.reduce((obj, key, index) => {
          obj[key.trim()] = values[index]?.trim() || null;
          return obj;
        }, {});
      });

      const validStudents = studentsData.filter(
        (student) => student.name && student.gender && student.dateofBirth
      );

      // Extract student codes from incoming data
      const incomingStudentCodes = validStudents
        .map((student) => student.studentCode)
        .filter(Boolean);

      if (incomingStudentCodes.length === 0) {
        return res
          .status(400)
          .json({ error: "Student codes are required for all students." });
      }

      // Check for duplicate codes in incoming data
      const duplicateIncomingCodes = incomingStudentCodes.filter(
        (code, index, arr) => arr.indexOf(code) !== index
      );

      if (duplicateIncomingCodes.length > 0) {
        return res.status(400).json({
          error: `Duplicate student codes in file: ${duplicateIncomingCodes.join(
            ", "
          )}`,
        });
      }

      // Check for duplicate codes in the database
      const existingStudents = await Student.findAll({
        where: { studentCode: incomingStudentCodes },
        attributes: ["studentCode"],
      });

      if (existingStudents.length > 0) {
        const existingCodes = existingStudents.map(
          (student) => student.studentCode
        );
        return res.status(400).json({
          message: `The following student codes already exist: ${existingCodes.join(
            ", "
          )}`,
        });
      }

      // Save valid students to the database
      const studentsToInsert = validStudents.map((student) => ({
        ...student,
        class: classSelect,
        section,
        parentAccount,
      }));

      await Student.bulkCreate(studentsToInsert, { validate: true });

      fs.unlinkSync(filePath);

      res.status(200).json({
        message: `${studentsToInsert.length} students added successfully`,
      });
    } catch (error) {
      console.error("Error uploading students:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
