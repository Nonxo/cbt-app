const Subject = require("./subject.model");

//Create a new Subject on POST
exports.createSubject = (req, res) => {
  Subject.findOne({ title: req.body.title }).then(subject => {
    if (subject) {
      return res.status(401).json({
        message: "Subject already exist"
      });
    } else {
      const subject = new Subject({
        title: req.body.title,
        duration: req.body.duration
      });
      subject
        .save()
        .then(result => {
          return res.status(201).json({
            message: `${result.title} created successfully`,
            result: result
          });
        })
        .catch(error => {
          return res.status(500).json({
            error: error
          });
        });
    }
  });
};

// Update a subject
exports.updateSubject = (req, res) => {
  const subject = new Subject({
    _id: req.body.id,
    title: req.body.title,
    duration: req.body.duration
  });
  Subject.updateOne({ _id: req.parma.id }, subject)
    .then(result => {
      res.status(200).json({
        message: `${subject.title} updated successfully`
      });
    })
    .catch(error => {
      return res.status(500).json({
        error: error
      });
    });
};

// Fetch all subjects
exports.fetchSubjects = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const subjectQuery = Subject.find();
  let fetchedSubjects;
  if (pageSize && currentPage) {
    subjectQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  subjectQuery
    .then(documents => {
      fetchedSubjects = documents;
      return Subject.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Subjects fetched successfully",
        subjects: fetchedSubjects,
        count: count
      });
    })
    .catch(error => {
      return res.status(500).json({
        error: error
      });
    });
};

// Fetch subject by id
exports.fetchSubjectsById = (req, res) => {
  Subject.findById(req.params.id).then(subject => {
    if (subject) {
      res.status(200).json({
        message: "Subject fetched successfully",
        subject: subject
      });
    } else {
      res.status(404).json({
        message: "Post not Found"
      });
    }
  });
};

// Delete subject by id
exports.deleteSubject = (req, res) => {
  Subject.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "Subject deleted" });
  });
};
