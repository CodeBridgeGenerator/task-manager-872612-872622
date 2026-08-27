
    module.exports = function (app) {
        const modelName = "task";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            title: { type:  String , required: true, index: true, trim: true, comment: "Title, inputText, false, true, true, true, true, true, true, , , , ," },
description: { type:  String , trim: true, comment: "Description, inputTextarea, false, true, true, true, true, true, true, , , , ," },
status: { type:  String , required: true, index: true, trim: true, comment: "Status, dropdown, false, true, true, true, true, true, true, , , , ," },
dueDate: { type: Date, comment: "Due Date, p_calendar, false, true, true, true, true, true, true, , , , ," },
priority: { type:  String , required: true, index: true, trim: true, comment: "Priority, dropdown, false, true, true, true, true, true, true, , , , ," },
assignedPerson: { type: Schema.Types.ObjectId, ref: "users", comment: "Assigned Person, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, displayName," },
project: { type: Schema.Types.ObjectId, ref: "project", comment: "Project, dropdown, false, true, true, true, true, true, true, project, project, one-to-one, name," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };