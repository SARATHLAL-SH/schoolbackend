const express = require("express");
const router = express.Router();
const FeeTable = require("../../modals/FeeTable"); // Adjust the path as necessary
const Student = require("../../modals/Student"); // Adjust the path as necessary

// Add a new fee record
router.post("/fee", async (req, res) => {
  try {
    const { StudentId, month } = req.body;

    // Validate required fields
    if (!StudentId || !month) {
      return res.status(400).json({
        error: "Validation failed",
        details: "StudentId and month are required fields.",
      });
    }

    // Check if a fee record already exists for the same StudentId and month
    const existingFee = await FeeTable.findOne({
      where: { StudentId, month },
    });

    if (existingFee) {
      return res.status(400).json({
        error: "Duplicate entry",
        details: "A fee record already exists for this student and month.",
      });
    }

    // Create a new fee record
    const feeRecord = await FeeTable.create(req.body);

    // Return the created fee record
    res.status(201).json({
      message: "Fee record created successfully",
      data: feeRecord,
    });
  } catch (error) {
    console.error("Error creating fee record:", error);

    // Handle duplicate entry error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Duplicate entry",
        details: "A fee record already exists for this student and month.",
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});


router.put("/fee/:id", async (req, res) => {
  try {
    // console.log("Received PUT request for fee update:", req.params.id, req.body);

    const fee = await FeeTable.findByPk(req.params.id);
    if (!fee) {
      // console.log("Fee record not found for ID:", req.params.id);
      return res.status(404).json({ error: "Fee record not found" });
    }

    // Attempt update
    await fee.update(req.body);

    // Fetch updated record
    const updatedFee = await FeeTable.findByPk(req.params.id);
    // console.log("Updated fee record:", updatedFee);

    res.status(200).json({
      message: "Fee record updated successfully",
      data: updatedFee,
    });
  } catch (error) {
    console.error("Error updating fee record:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Delete a fee record
router.delete("/fee/:id", async (req, res) => {
  try {
    const deleted = await FeeTable.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Fee record not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all fee records with student details
router.get("/fee", async (req, res) => {
  try {
    const feeRecords = await FeeTable.findAll({
      include: [
        {
          model: Student,
          as: "student",
        },
      ],
      order: [["date", "ASC"]],
    });

    res.status(200).json(feeRecords);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get data using studentId
router.get("/fee/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const feeRecords = await FeeTable.findAll({
      where: { StudentId: studentId },
      include: [
        {
          model: Student,
          as: "student",
        },
      ],
      order: [["date", "ASC"]],
    });

    if (feeRecords.length === 0) {
      return res
        .status(404)
        .json({ error: "No fee records found for this student" });
    }

    res.status(200).json(feeRecords);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/advance/:id", async (req, res) => {
  try {
    const { advance } = req.body; // Get new advance value from request body

    // Find the record by ID and update the advance field
    const [updated] = await FeeTable.update(
      { advance }, // Fields to update
      { where: { id: req.params.id } } // Find record by ID
    );

    if (updated) {
      const updatedRecord = await FeeTable.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedRecord);
    } else {
      res.status(404).json({ error: "Fee record not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




module.exports = router;
