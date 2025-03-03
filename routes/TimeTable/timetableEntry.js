const express = require("express");
const router = express.Router();
const Timetable = require("../../modals/TimeTable/Timetable");

router.post("/add_Timetable", async (req, res) => {
  const { classId, divisionId, day, timePeriodId, subjectId } = req.body;

  const timetableEntry = await Timetable.create({
    classId,
    divisionId,
    day,
    timePeriodId,
    subjectId,
  });

  res.json(timetableEntry);
});

module.exports = router;
