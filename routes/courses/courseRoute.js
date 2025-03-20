const express = require("express");
const router = express.Router();
const Course = require("../../modals/courseModal/Course");

// ✅ Get all courses
router.get("/get_courses", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get course by ID
router.get("/get_course/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add a new course
router.post("/add_course", async (req, res) => {
  const { category, duration, name, syllabus } = req.body;

  if (!category || !duration || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {

    const syllabusData = Array.isArray(syllabus)
    ? syllabus
    : JSON.parse(syllabus);  // ✅ Parse stringified JSON

    const newCourse = await Course.create({
      category,
      duration,
      name,
      syllabus:syllabusData,
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
});

// ✅ Update a course by ID
router.put("/update_course/:id", async (req, res) => {
  const { id } = req.params;
  const { category, duration, name, syllabus } = req.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Update course details
    course.category = category || course.category;
    course.duration = duration || course.duration;
    course.name = name || course.name;
    course.syllabus = syllabus || course.syllabus;

    await course.save();

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// ✅ Delete a course by ID
router.delete("/delete_course/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

module.exports = router;
