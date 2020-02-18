const SubjectService = require("./subject.service");
const path = require("path");

//Create a new Subject on POST
exports.createSubject = (req, res) => {
  const data = req.body;
  SubjectService.addSubject(data).then((result, error) => {
    console.log(result);
    if (error) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(201).json({
      success: true,
      message: result
    });
  });
};

exports.index = function(req, res) {
  return res.sendfile(path.resolve("app/views/home/index.html"));
};
