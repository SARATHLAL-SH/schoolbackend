const sequelize = require("./sequelize");
const User = require("./modals/User");
const Student = require("./modals/Student");
const Employee = require("./modals/Employee")(async () => {
  try {
    // Sync the model with the database
    await sequelize.sync({ force: false }); // `force: true` will drop and recreate the table
    console.log("The users table has been created successfully.");
  } catch (error) {
    console.error("Error creating the table:", error);
  } finally {
    await sequelize.close(); // Close the connection
  }
})();
