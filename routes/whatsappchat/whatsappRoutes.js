const express = require("express");
const { sendMessage } = require("../../services/whatsappService");

const router = express.Router();

router.post("/send", async (req, res) => {
  const { recipient, message } = req.body;

  if (!recipient || !message) {
    return res
      .status(400)
      .json({ error: "Recipient and message are required" });
  }

  try {
    await sendMessage(recipient, message);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
