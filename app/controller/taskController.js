const { Box } = require("../models/Box");
const { Task } = require("../models/Task");
const { User } = require("../models/User");

const createTask = async (req, res) => {
  const { boxId, title, description, dueDate,userId } = req.body;

  try {
    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (box.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only box owner can create tasks" });
    }

    const task = new Task.create({
      box: box._id,
      title,
      description,
      dueDate,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Task creation failed", error: err.message });
  }
};

const getTask = async (req, res) => {
  const { boxId } = req.query;

  try {
    const tasks = await Task.find({ box: boxId }).populate(
      "completedBy",
      "name email"
    );
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching tasks failed", error: err.message });
  }
};

const completeTask = async (req, res) => {
  const { userEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.isCompleted = true;
    task.completedBy = user._id;
    await task.save();

    res.status(200).json({ message: "Task completed", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to complete task", error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: err.message });
  }
};

module.exports = {
  getTask,
  createTask,
  completeTask,
  deleteTask,
};
