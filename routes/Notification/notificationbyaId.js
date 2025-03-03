const express = require("express");
const router = express.Router();
const webPush = require("web-push");
const path = require("path");
const Subscriptions = require("../../modals/Subscriptions");

// router.use("../../assets", express.static(path.join(__dirname, "assets")));

const vapidKeys = {
  publicKey:
    "BErn7s83cgqhG0ITDM1wWdlwSDsAOQ03y7vZjUGCzEDtgYx08kPABdPpLGmSQKYb_IeyYxShnBMppYLclmYo-ts",
  privateKey: "abGTKUVcmipond3ashUdrm6fPpIlxwuuxoB4Hdl_O1E",
};

webPush.setVapidDetails(
  "mailto:example@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
let savedSubscription = null;
// Route to Save Subscription

  // Route to Trigger Notification
  //********************************* */
//   router.post("/send-subscription", (req, res) => {
//     savedSubscription = req.body.subscription;
//     console.log("Subscription received:", savedSubscription);
//     res.status(201).json({ message: "Subscription saved." });
//   });
  
  // Route to Trigger Notification
  router.post("/send-notification/:userId", async (req, res) => {
    const { userId } = req.params;
    const { title, body } = req.body;
  
    try {
      const subscription = await Subscriptions.findOne({ where: { userId } });
  
      if (!subscription) {
        return res.status(404).json({ error: "No subscription found for this user." });
      }
  
      const payload = JSON.stringify({
        title: title || "Notification",
        body: body || "Default message",
        icon: "../../assets/pexelsrmv.png",
      });
  
      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };
  
      await webPush.sendNotification(subscriptionData, payload);
      res.status(200).json({ success: true, message: "Notification sent successfully." });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ success: false, error: "Failed to send notification" });
    }
  });
  
module.exports = router;
