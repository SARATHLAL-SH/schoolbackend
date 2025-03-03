const express = require("express");
const router = express.Router();
const Chat = require("../../modals/chat");
const { Op } = require("sequelize");

// Get chat history between a teacher and a student
router.get("/history/:teacherId/:studentId", async (req, res) => {
  try {
    const { teacherId, studentId } = req.params;
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: teacherId, receiverId: studentId },
          { senderId: studentId, receiverId: teacherId },
        ],
      },
      order: [["timestamp", "ASC"]],
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat history." });
    console.log(error);
  }
});

router.get("/chat_history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all chats where the user is either the sender or the receiver
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      order: [["timestamp", "ASC"]],
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve chat history." });
    console.error(error);
  }
});

// Save a new chat message
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newChat = await Chat.create({ senderId, receiverId, message });
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to save chat message." });
  }
});

module.exports = router;
