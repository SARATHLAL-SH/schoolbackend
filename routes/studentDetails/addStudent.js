const express = require("express");
const router = express.Router();
const Student = require("../../modals/Student");

const refreshAccessToken = require("../../middlewares/refreshAccessToken");


// Route to add a new student
router.post("/add_student", refreshAccessToken, async (req, res) => {
  try {
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    console.log("data====>", data);
    const placeholders = fields.map(() => "?").join(", ");

    const newStudent = await Student.create(data);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
