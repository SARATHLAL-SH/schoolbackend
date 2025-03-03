const express = require("express");
const router = express.Router();
const Class = require("../../modals/TimeTable/Class");
const Division = require("../../modals/TimeTable/Division");
const TimePeriod = require("../../modals/TimeTable/TimePeriod");
const Subject = require("../../modals/TimeTable/Subject");
const refreshAccessToken = require("../../middlewares/refreshAccessToken");

router.post("/add_Class", async (req, res) => {
  const { name } = req.body;
  const newClass = await Class.create({ name });
  res.json(newClass);
});

router.post("/add_Division", async (req, res) => {
  const { name } = req.body;
  const newDivision = await Division.create({ name });
  res.json(newDivision);
});

router.post("/add_Subject", async (req, res) => {
  const { name } = req.body;
  const newSubject = await Subject.create({ name });
  res.json(newSubject);
});

router.post("/add_Timeperiod", async (req, res) => {
  const { startTime, endTime } = req.body;
  const newPeriod = await TimePeriod.create({ startTime, endTime });
  res.json(newPeriod);
});

// ✅ Get all Classes
router.get("/get_Classes",  async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all Divisions
router.get("/get_Divisions",  async (req, res) => {
  try {
    const divisions = await Division.findAll();
    res.json(divisions);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all Subjects
router.get("/get_Subjects", async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all Time Periods
router.get("/get_Timeperiods", async (req, res) => {
  try {
    const timePeriods = await TimePeriod.findAll();
    res.json(timePeriods);
  } catch (error) {
    console.error("Error fetching time periods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;