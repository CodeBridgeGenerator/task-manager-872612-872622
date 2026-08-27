const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("comment service", async () => {
  let thisService;
  let commentCreated;
  let usersServiceResults;
  let users;

  const projectCreated = await app.service("project").Model.create({"author":"parentObjectId","content":"new value","createdDate":"2026-08-27T19:55:01.424Z","attachment":{"name":"John Doe Many","age":20,"dateofbirth":"1999-01-01T00:00:00.000Z"},"parentComment":"parentObjectId","task":"parentObjectId","title":"new value","description":"new value","status":"new value","dueDate":"2026-08-27T19:55:01.425Z","priority":"new value","assignedPerson":"parentObjectId","project":"parentObjectId","name":"new value","startDate":"2026-08-27T19:55:01.425Z","endDate":"2026-08-27T19:55:01.425Z","visibility":"new value","teamMembers":"parentObjectId"});
const taskCreated = await app.service("task").Model.create({"author":"parentObjectId","content":"new value","createdDate":"2026-08-27T19:55:01.424Z","attachment":{"name":"John Doe Many","age":20,"dateofbirth":"1999-01-01T00:00:00.000Z"},"parentComment":"parentObjectId","task":"parentObjectId","title":"new value","description":"new value","status":"new value","dueDate":"2026-08-27T19:55:01.425Z","priority":"new value","assignedPerson":"parentObjectId","project":`${projectCreated._id}`,"name":"new value","startDate":"2026-08-27T19:55:01.425Z","endDate":"2026-08-27T19:55:01.425Z","visibility":"new value","teamMembers":"parentObjectId"});
const commentCreated = await app.service("comment").Model.create({"author":"parentObjectId","content":"new value","createdDate":"2026-08-27T19:55:01.424Z","attachment":{"name":"John Doe Many","age":20,"dateofbirth":"1999-01-01T00:00:00.000Z"},"parentComment":"parentObjectId","task":`${taskCreated._id}`,"title":"new value","description":"new value","status":"new value","dueDate":"2026-08-27T19:55:01.425Z","priority":"new value","assignedPerson":"parentObjectId","project":`${projectCreated._id}`,"name":"new value","startDate":"2026-08-27T19:55:01.425Z","endDate":"2026-08-27T19:55:01.425Z","visibility":"new value","teamMembers":"parentObjectId"});

  beforeEach(async () => {
    thisService = await app.service("comment");

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
    assert.ok(thisService, "Registered the service (comment)");
  });

  describe("#create", () => {
    const options = {"author":"parentObjectId","content":"new value","createdDate":"2026-08-27T19:55:01.424Z","attachment":{"name":"John Doe Many","age":20,"dateofbirth":"1999-01-01T00:00:00.000Z"},"parentComment":`${commentCreated._id}`,"task":"parentObjectId","title":"new value","description":"new value","status":"new value","dueDate":"2026-08-27T19:55:01.425Z","priority":"new value","assignedPerson":"parentObjectId","project":`${projectCreated._id}`,"name":"new value","startDate":"2026-08-27T19:55:01.425Z","endDate":"2026-08-27T19:55:01.425Z","visibility":"new value","teamMembers":"parentObjectId"};

    beforeEach(async () => {
      commentCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new comment", () => {
      assert.strictEqual(commentCreated.author.toString(), options.author.toString());
assert.strictEqual(commentCreated.content, options.content);
assert.strictEqual(commentCreated.createdDate.toISOString(), options.createdDate);
assert.strictEqual(commentCreated.attachment, options.attachment);
assert.strictEqual(commentCreated.parentComment.toString(), options.parentComment.toString());
assert.strictEqual(commentCreated.task.toString(), options.task.toString());
    });
  });

  describe("#get", () => {
    it("should retrieve a comment by ID", async () => {
      const retrieved = await thisService.Model.findById(commentCreated._id);
      assert.strictEqual(retrieved._id.toString(), commentCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"author":`${usersCreated._id}`,"content":"updated value","createdDate":"2026-08-27T19:55:01.424Z","attachment":{"name":"John Doe","age":200,"dateofbirth":"2025-01-31T00:00:00.000Z"},"parentComment":`${commentCreated._id}`,"task":`${taskCreated._id}`};

    it("should update an existing comment ", async () => {
      const commentUpdated = await thisService.Model.findByIdAndUpdate(
        commentCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(commentUpdated.author.toString(), options.author.toString());
assert.strictEqual(commentUpdated.content, options.content);
assert.strictEqual(commentUpdated.createdDate.toISOString(), options.createdDate);
assert.strictEqual(commentUpdated.attachment, options.attachment);
assert.strictEqual(commentUpdated.parentComment.toString(), options.parentComment.toString());
assert.strictEqual(commentUpdated.task.toString(), options.task.toString());
    });
  });

  describe("#delete", async () => {
    it("should delete a comment", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("project").Model.findByIdAndDelete(projectCreated._id);
await app.service("task").Model.findByIdAndDelete(taskCreated._id);
await app.service("comment").Model.findByIdAndDelete(commentCreated._id);;

      const commentDeleted = await thisService.Model.findByIdAndDelete(commentCreated._id);
      assert.strictEqual(commentDeleted._id.toString(), commentCreated._id.toString());
    });
  });
});