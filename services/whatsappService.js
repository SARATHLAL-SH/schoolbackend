const wppconnect = require("@wppconnect-team/wppconnect");
const socketIo = require("socket.io");

let client;

async function startClient() {
  if (client) return client;

  try {
    client = await wppconnect.create({
      session: "whatsapp-bot",
      autoClose: false,
      qrTimeout: 0,
      catchQR: (qrCode, asciiQR) => {
        console.log("QR Code:", qrCode);
        io.emit("qrCode", qrCode); // Send QR Code to frontend
      },
    });

    setupClientEvents(client);
    console.log("WhatsApp client started");
    return client;
  } catch (err) {
    console.error("Error starting WhatsApp client:", err);
  }
}

function setupClientEvents(client) {
  client.onMessage(async (msg) => {
    if (msg.from !== "status@broadcast") {
      console.log(`Received from ${msg.from}: ${msg.body}`);
    }
  });

  // Handle disconnection event
  client.onStateChange((state) => {
    console.log(`Client state changed: ${state}`);
    if (state === "DISCONNECTED" || state === "CONFLICT") {
      console.log("Client disconnected. Attempting to reconnect...");
      reconnectClient();
    }
  });

  client.on("disconnected", (reason) => {
    console.error(`Client disconnected due to: ${reason}`);
    reconnectClient();
  });
}

async function reconnectClient() {
  console.log("Reconnecting to WhatsApp...");
  client = null;
  await startClient();
}

async function sendMessage(recipient, message) {
  if (!client) {
    await startClient();
  }
  try {
    await client.sendText(`${recipient}@c.us`, message);
    console.log(`Message sent to ${recipient}: "${message}"`);
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

function initSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Frontend connected to Socket.IO");

    // Send initial client state when frontend connects
    if (client) {
      client.getConnectionState().then((state) => {
        socket.emit("clientState", state);
      });
    }
  });
}

module.exports = {
  startClient,
  sendMessage,
  initSocket,
};
