const express = require("express");
const router = express.Router();
const Employee = require("../../modals/Employee");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.post("/add_Employee", refreshAccessToken, async (req, res) => {
    try {
      const data = req.body;
      const fields = Object.keys(data);
      const values = Object.values(data);
      console.log("data====>", data);
      const placeholders = fields.map(() => "?").join(", ");
  
      const newStudent = await Employee.create(data);
      res.status(201).json(newStudent);
    } catch (error) {
      console.error("Error adding student:", error);
      res.status(400).json({ error: error.message });
    }
  });

  module.exports = router;