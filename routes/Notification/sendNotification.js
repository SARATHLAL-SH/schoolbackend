const express = require("express");
const router = express.Router();
const webPush = require("web-push");
const Subscriptions = require("../../modals/Subscriptions");

const vapidKeys = {
  publicKey: "BErn7s83cgqhG0ITDM1wWdlwSDsAOQ03y7vZjUGCzEDtgYx08kPABdPpLGmSQKYb_IeyYxShnBMppYLclmYo-ts",
  privateKey: "abGTKUVcmipond3ashUdrm6fPpIlxwuuxoB4Hdl_O1E",
};

webPush.setVapidDetails(
  "mailto:example@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Route to Trigger Notification
router.post("/send-notification", async (req, res) => {
  try {
    const payload = JSON.stringify({
      title: "New Notification",
      body: "Your students' attendance is pending",
      icon: "../../assets/pexelsrmv.png",
    });

    const subscriptions = await Subscriptions.findAll();

    if (!subscriptions.length) {
      return res.status(404).json({ error: "No subscriptions found." });
    }

    const notificationPromises = subscriptions.map(async (sub) => {
      const subscriptionData = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };
      try {
        await webPush.sendNotification(subscriptionData, payload);
      } catch (err) {
        console.error("Error sending notification to subscription:", subscriptionData, err);
      }
    });

    await Promise.all(notificationPromises);

    res.status(200).json({ success: true, message: "Notifications sent successfully." });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ success: false, error: "Failed to send notifications." });
  }
});

module.exports = router;
