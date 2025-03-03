const express = require("express");
const router = express.Router();
const Timetable = require("../../modals/TimeTable/Timetable");
// Update Subject for a TimePeriod
router.put("/timetable/:id", async (req, res) => {
  const { subjectId } = req.body;
  await Timetable.update({ subjectId }, { where: { id: req.params.id } });
  res.json({ message: "Updated Successfully" });
});

// Delete a timetable entry
router.delete("/delete_timetable/:id", async (req, res) => {
  await Timetable.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted Successfully" });
});

module.exports = router;
