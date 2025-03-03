const db = require("../index"); // Adjust this path if necessary

// Fetch messages by parentId
const getMessagesByParentId = (parentId, callback) => {
  db.query(
    "SELECT * FROM messages WHERE parentId = ?",
    [parentId],
    (err, results) => {
      callback(err, results);
    }
  );
};

// Insert new message
const insertMessage = (parentId, content, callback) => {
  db.query(
    "INSERT INTO messages (parentId, content) VALUES (?, ?)",
    [parentId, content],
    (err) => {
      callback(err);
    }
  );
};

module.exports = {
  getMessagesByParentId,
  insertMessage,
};
