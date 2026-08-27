const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("project service", async () => {
  let thisService;
  let projectCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("project");

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
    assert.ok(thisService, "Registered the service (project)");
  });

  describe("#create", () => {
    const options = {"name":"new value","description":"new value","startDate":"2026-08-27T19:55:01.256Z","endDate":"2026-08-27T19:55:01.256Z","status":"new value","visibility":"new value","teamMembers":"parentObjectId"};

    beforeEach(async () => {
      projectCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new project", () => {
      assert.strictEqual(projectCreated.name, options.name);
assert.strictEqual(projectCreated.description, options.description);
assert.strictEqual(projectCreated.startDate.toISOString(), options.startDate);
assert.strictEqual(projectCreated.endDate.toISOString(), options.endDate);
assert.strictEqual(projectCreated.status, options.status);
assert.strictEqual(projectCreated.visibility, options.visibility);
assert.strictEqual(projectCreated.teamMembers.toString(), options.teamMembers.toString());
    });
  });

  describe("#get", () => {
    it("should retrieve a project by ID", async () => {
      const retrieved = await thisService.Model.findById(projectCreated._id);
      assert.strictEqual(retrieved._id.toString(), projectCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"name":"updated value","description":"updated value","startDate":"2026-08-27T19:55:01.256Z","endDate":"2026-08-27T19:55:01.256Z","status":"updated value","visibility":"updated value","teamMembers":`${usersCreated._id}`};

    it("should update an existing project ", async () => {
      const projectUpdated = await thisService.Model.findByIdAndUpdate(
        projectCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(projectUpdated.name, options.name);
assert.strictEqual(projectUpdated.description, options.description);
assert.strictEqual(projectUpdated.startDate.toISOString(), options.startDate);
assert.strictEqual(projectUpdated.endDate.toISOString(), options.endDate);
assert.strictEqual(projectUpdated.status, options.status);
assert.strictEqual(projectUpdated.visibility, options.visibility);
assert.strictEqual(projectUpdated.teamMembers.toString(), options.teamMembers.toString());
    });
  });

  describe("#delete", async () => {
    it("should delete a project", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const projectDeleted = await thisService.Model.findByIdAndDelete(projectCreated._id);
      assert.strictEqual(projectDeleted._id.toString(), projectCreated._id.toString());
    });
  });
});