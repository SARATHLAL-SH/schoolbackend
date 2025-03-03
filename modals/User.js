const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { Sequelize } = require("sequelize");
// Define the IdSequence model
const IdSequence = sequelize.define(
  "IdSequence",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lastUsedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10000, // Start from 10000
    },
  },
  {
    tableName: "id_sequence",
    timestamps: false,
  }
);

// Define the User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER, // Correct type for string-based IDs
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "users",
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        // Fetch the last used ID from the id_sequence table
        const sequence = await IdSequence.findOne();
        let lastUsedId = sequence.lastUsedId;

        // Increment the last used ID
        lastUsedId += 1001;

        // Update the last used ID in the id_sequence table
        await IdSequence.update({ lastUsedId }, { where: { id: sequence.id } });

        // Generate the custom ID in the format "S10001"
        user.id = lastUsedId;
      },
    },
  }
);
// Define the association
User.associate = (models) => {
  User.hasMany(models.Student, {
    foreignKey: "fatherEmail", // Foreign key in the Student table
    sourceKey: "email", // Key in the User table
    as: "students", // Alias for the association
  });
};
// Initialize the id_sequence table
(async () => {
  await sequelize.sync();
  const sequence = await IdSequence.findOne();
  if (!sequence) {
    await IdSequence.create({ lastUsedId: 10000 });
  }
})();

module.exports = User;
