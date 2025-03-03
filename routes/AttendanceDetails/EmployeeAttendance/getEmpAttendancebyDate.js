const express = require("express");
const router = express.Router();
const EmpAttendance = require("../../../modals/EmpAttendance");
const Employee = require("../../../modals/Employee");
const refreshAccessToken = require("../../../middlewares/refreshAccessToken");
const {
  generatePresignedUrl,
} = require("../../../routes/UploadBucket/s3Utils");
const { Op, Sequelize } = require("sequelize");

router.get("/getEmpAttendanceByDate", refreshAccessToken, async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: EmpAttendance,
          as: "empAttendances",
          where: {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("empAttendances.date")),
                "=",
                date
              ), // Ensures correct DATE comparison
              { status: "undefined" },
            ],
          },
          required: false, // Ensures employees are returned even if no attendance record exists
        },
      ],
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance found for the given date" });
    }

    const employeesWithImageUrls = await Promise.all(
      employees.map(async (employee) => {
        const imageUrl = await generatePresignedUrl(
          employee.photo || "66925640c4a9c61a716cc8fd_Products/user.jpg"
        );
        return {
          ...employee.dataValues,
          imageUrl,
        };
      })
    );

    return res.status(200).json(employeesWithImageUrls);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/getAllEmployeeAttendanceReport",
  refreshAccessToken,
  async (req, res) => {
    try {
      const employees = await Employee.findAll({
        include: [
          {
            model: EmpAttendance,
            as: "empAttendances",
            required: false, // Include employees even if they have no attendance records
          },
        ],
      });

      if (!employees || employees.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }

      const employeesWithImageUrls = await Promise.all(
        employees.map(async (employee) => {
          const imageUrl = await generatePresignedUrl(
            employee.photo || "66925640c4a9c61a716cc8fd_Products/user.jpg"
          );

          return {
            ...employee.dataValues,
            imageUrl,
            empAttendances: employee.empAttendances || [],
          };
        })
      );

      return res.status(200).json(employeesWithImageUrls);
    } catch (error) {
      console.error("Error fetching employee attendance report:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
