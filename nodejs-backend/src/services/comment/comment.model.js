
    module.exports = function (app) {
        const modelName = "comment";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            author: { type: Schema.Types.ObjectId, ref: "users", comment: "Author, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, displayName," },
content: { type:  String , required: true, trim: true, comment: "Content, inputTextarea, false, true, true, true, true, true, true, , , , ," },
createdDate: { type: Date, required: true, comment: "Created Date, p_calendar, false, true, true, true, true, true, true, , , , ," },
attachment: { type: Schema.Types.Mixed , comment: "Attachment, inputTextarea, false, true, true, true, true, true, true, , , , ," },
parentComment: { type: Schema.Types.ObjectId, ref: "comment", comment: "Parent Comment, dropdown, false, true, true, true, true, true, true, comment, comment, one-to-one, content," },
task: { type: Schema.Types.ObjectId, ref: "task", comment: "Task, dropdown, false, true, true, true, true, true, true, task, task, one-to-one, title," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };