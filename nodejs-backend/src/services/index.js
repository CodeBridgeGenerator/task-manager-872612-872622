const task = require("./task/task.service.js");
const project = require("./project/project.service.js");
const comment = require("./comment/comment.service.js");
// ~cb-add-require-service-name~

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(task);
  app.configure(project);
  app.configure(comment);
    // ~cb-add-configure-service-name~
};
