const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("task service", async () => {
  let thisService;
  let taskCreated;
  let usersServiceResults;
  let users;

  const projectCreated = await app.service("project").Model.create({"title":"new value","description":"new value","status":"new value","dueDate":"2026-08-27T19:55:00.948Z","priority":"new value","assignedPerson":"parentObjectId","project":"parentObjectId","name":"new value","startDate":"2026-08-27T19:55:00.951Z","endDate":"2026-08-27T19:55:00.952Z","visibility":"new value","teamMembers":"parentObjectId"});

  beforeEach(async () => {
    thisService = await app.service("task");

    // Create users here
    usersServiceResults = await app.service("users").Model.create(usersRefData);
    users = {
      createdBy: usersServiceResults[0]._id,
      updatedBy: usersServiceResults[0]._id,
    };
  });

  after(async () => {
    if (usersServiceResults) {
      await Promise.all(
        usersServiceResults.map((i) =>
          app.service("users").Model.findByIdAndDelete(i._id)
        )
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (task)");
  });

  describe("#create", () => {
    const options = {"title":"new value","description":"new value","status":"new value","dueDate":"2026-08-27T19:55:00.948Z","priority":"new value","assignedPerson":"parentObjectId","project":`${projectCreated._id}`,"name":"new value","startDate":"2026-08-27T19:55:00.951Z","endDate":"2026-08-27T19:55:00.952Z","visibility":"new value","teamMembers":"parentObjectId"};

    beforeEach(async () => {
      taskCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new task", () => {
      assert.strictEqual(taskCreated.title, options.title);
assert.strictEqual(taskCreated.description, options.description);
assert.strictEqual(taskCreated.status, options.status);
assert.strictEqual(taskCreated.dueDate.toISOString(), options.dueDate);
assert.strictEqual(taskCreated.priority, options.priority);
assert.strictEqual(taskCreated.assignedPerson.toString(), options.assignedPerson.toString());
assert.strictEqual(taskCreated.project.toString(), options.project.toString());
    });
  });

  describe("#get", () => {
    it("should retrieve a task by ID", async () => {
      const retrieved = await thisService.Model.findById(taskCreated._id);
      assert.strictEqual(retrieved._id.toString(), taskCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"title":"updated value","description":"updated value","status":"updated value","dueDate":"2026-08-27T19:55:00.948Z","priority":"updated value","assignedPerson":`${usersCreated._id}`,"project":`${projectCreated._id}`};

    it("should update an existing task ", async () => {
      const taskUpdated = await thisService.Model.findByIdAndUpdate(
        taskCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(taskUpdated.title, options.title);
assert.strictEqual(taskUpdated.description, options.description);
assert.strictEqual(taskUpdated.status, options.status);
assert.strictEqual(taskUpdated.dueDate.toISOString(), options.dueDate);
assert.strictEqual(taskUpdated.priority, options.priority);
assert.strictEqual(taskUpdated.assignedPerson.toString(), options.assignedPerson.toString());
assert.strictEqual(taskUpdated.project.toString(), options.project.toString());
    });
  });

  describe("#delete", async () => {
    it("should delete a task", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("project").Model.findByIdAndDelete(projectCreated._id);;

      const taskDeleted = await thisService.Model.findByIdAndDelete(taskCreated._id);
      assert.strictEqual(taskDeleted._id.toString(), taskCreated._id.toString());
    });
  });
});