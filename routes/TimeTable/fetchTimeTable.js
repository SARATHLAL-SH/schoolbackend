const express = require("express");
const router = express.Router();
const Timetable = require("../../modals/TimeTable/Timetable");
const TimePeriod = require("../../modals/TimeTable/TimePeriod");
const Subject = require("../../modals/TimeTable/Subject");

router.get("/get_timetable/:classId/:divisionId", async (req, res) => {
  const { classId, divisionId } = req.params;

  const timetable = await Timetable.findAll({
    where: { classId, divisionId },
    include: [TimePeriod, Subject],
    order: [["day", "ASC"]],
  });

  res.json(timetable);
});

module.exports = router;
