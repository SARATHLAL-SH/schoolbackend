const express = require("express");
const router = express.Router();
const User = require("../../modals/User");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");
const { generatePresignedUrl } = require("../../routes/UploadBucket/s3Utils");

router.get("/get_users", refreshAccessToken, async (req, res) => {
    try {
      const employees = await User.findAll();
     
      res.status(200).json(employees);
    } catch (err) {
      console.error("Error fetching user:", err.message);
      res.status(400).json({ error: err.message });
    }
  });

  module.exports = router;