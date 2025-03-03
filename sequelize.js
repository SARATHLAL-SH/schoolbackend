const { Sequelize } = require("sequelize");
require('dotenv').config(); 

// Initialize Sequelize 
const sequelize = new Sequelize(
  process.env.DB_NAME || "shooldb",   
  process.env.DB_USER || "root",        
  process.env.DB_PASSWORD || "",        
  {
    host: process.env.DB_HOST || "localhost", 
    dialect: "mysql",
    logging: false, // Disable SQL logging
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
