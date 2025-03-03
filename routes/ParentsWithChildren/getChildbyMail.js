const express = require("express");
const router = express.Router();
const Student = require("../../modals/Student");
const User = require("../../modals/User");

const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.get("/getSudentbyMail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const userDetails = await User.findOne({
      where: { email },
      include: [
        {
          model: Student,
          as: "students",
        },
      ],
    });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
