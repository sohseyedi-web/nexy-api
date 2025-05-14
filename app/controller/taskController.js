const { Box } = require("../models/Box");
const { Task } = require("../models/Task");

const createTask = async (req, res) => {
  const { boxId, title, description, dueDate } = req.body;
  const owner = req.user;

  try {
    if (!owner || !owner._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (box.owner.toString() !== owner._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only box owner can create tasks" });
    }

    if (dueDate && isNaN(new Date(dueDate))) {
      return res.status(400).json({ message: "Invalid due date format" });
    }

    const task = new Task({
      box: box._id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
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
  const owner = req.user;

  try {
    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (!box.members.includes(owner._id)) {
      return res.status(403).json({ message: "Access denied to this box" });
    }

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
  const user = req.user;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const box = await Box.findById(task.box);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (!box.members.includes(user._id)) {
      return res
        .status(403)
        .json({ message: "Only box members can complete tasks" });
    }

    task.completed = true;
    task.completedBy = requester._id;
    await task.save();

    res.status(200).json({ message: "Task completed", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to complete task", error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const owner = req.user;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const box = await Box.findById(task.box);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (box.owner.toString() !== owner._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only box owner can delete tasks" });
    }

    await task.deleteOne();
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
