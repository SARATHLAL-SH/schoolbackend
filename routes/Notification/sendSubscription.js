const express = require("express");
const router = express.Router();
const Subscriptions = require("../../modals/Subscriptions");

router.post("/send-subscription", async (req, res) => {
    const { subscription, userId } = req.body;
  
    if (!subscription || !userId) {
      return res.status(400).json({ error: "Subscription and userId are required" });
    }
  
    try {
      const { endpoint, keys } = subscription;
  
      // Upsert subscription to avoid duplicates for the same user
      await Subscriptions.upsert({
        userId,
        Endpoint:endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      });
  
      res.status(201).json({ message: "Subscription saved successfully." });
    } catch (error) {
      console.error("Error saving subscription:", error);
      res.status(500).json({ error: "Failed to save subscription." });
    }
  });
  module.exports = router;  
  