const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  box: { type: mongoose.Schema.Types.ObjectId, ref: "Box", required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = {
  Task: mongoose.model("Task", TaskSchema),
};
