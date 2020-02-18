const express = require("express");
const router = express.Router();
const SubjectController = require("./subject.controller");

const { createSubject } = SubjectController;
// POST request fo creating subject
router.route("/subject/create").post(createSubject);

module.exports = router;
