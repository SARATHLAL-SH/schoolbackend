const express = require("express");
const router = express.Router();
const sequelize = require("../../sequelize");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");
const Employee = require("../../modals/Employee");
const { generatePresignedUrl } = require("../../routes/UploadBucket/s3Utils");

//Route to get all Employees
router.get("/get_employees", refreshAccessToken, async (req, res) => {
  try {
    const employees = await Employee.findAll();
    //generate image
    //////////////////////////////////
    const employeesWithImageUrls = await Promise.all(
      employees.map(async (employee) => {
        const imageUrl = await generatePresignedUrl(employee.photo || "66925640c4a9c61a716cc8fd_Products/user.jpg"); 
        return {
          ...employee.dataValues, 
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
