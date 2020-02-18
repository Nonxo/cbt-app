const express = require("express");
const router = express.Router();
const SubjectController = require("./subject.controller");

const {
  createSubject,
  fetchSubjects,
  updateSubject,
  fetchSubjectsById,
  deleteSubject
} = SubjectController;

// Subject routes
router.route("/create").post(createSubject);
router.route("/update/:id").put(updateSubject);
router.route("").get(fetchSubjects);
router.route("/:id").get(fetchSubjectsById);
router.route("/delete/:id").delete(deleteSubject);

module.exports = router;
