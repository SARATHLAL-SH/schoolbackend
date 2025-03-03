const express = require("express");
const User = require("../../modals/User");
const router = express.Router();

router.delete("/delete_user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
