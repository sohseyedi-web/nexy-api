const express = require("express");
const {
  createTask,
  getTask,
  completeTask,
  deleteTask,
} = require("../controller/taskController");

const router = express.Router();

router.post("/create", createTask);
router.get("/", getTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = {
  TaskRoutes: router,
};
