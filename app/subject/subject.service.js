const Subject = require("./subject.model");

exports.addSubject = data => {
  const newSubject = new Subject({
    duration: data.duration,
    title: data.title
  });
  const validSubject = Subject.exists({
    title: data.title
  });
  if (validSubject) {
    return {
      error: true,
      message: "Subject already exist"
    };
  }
  newSubject.save().then((result, error) => {
    console.log(result);
    if (result) {
      return {
        error: false,
        message: `${result.title} subject successfully created`
      };
    }
    if (error) {
      throw new Error(error);
    }
  });
};
