const express = require("express");
const router = express.Router();
const Syllabus = require("../../modals/courseModal/Syllabus");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.post("/add_Syllubus", async (req, res) => {
  const { name } = req.body;
  const newSyllubus = await Syllabus.create({ name });
  res.json(newSyllubus);
});

router.get("/get_Syllubus", async (req, res) => {
  try {
    const syllabusData = await Syllabus.findAll(); // ✅ Use a different variable name
    res.json(syllabusData);
  } catch (error) {
    console.error("Error fetching Syllabus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update_syllabus/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const syllabus = await Syllabus.findByPk(id);
    if (!syllabus) {
      return res.status(404).json({ error: "Syllabus not found" });
    }

    // Update the name
    syllabus.name = name || syllabus.name;
    await syllabus.save();

    res.json({ message: "Syllabus updated successfully", syllabus });
  } catch (error) {
    console.error("Error updating syllabus:", error);
    res.status(500).json({ error: "Failed to update syllabus" });
  }
});

// ✅ Delete a syllabus record
router.delete("/delete_syllabus/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const syllabus = await Syllabus.findByPk(id);
    if (!syllabus) {
      return res.status(404).json({ error: "Syllabus not found" });
    }

    await syllabus.destroy();
    res.json({ message: "Syllabus deleted successfully" });
  } catch (error) {
    console.error("Error deleting syllabus:", error);
    res.status(500).json({ error: "Failed to delete syllabus" });
  }
});

module.exports = router;
