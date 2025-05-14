const express = require("express");
const {
  createTask,
  getTask,
  completeTask,
  deleteTask,
} = require("../controller/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.get("/", authMiddleware, getTask);
router.patch("/:id/complete", authMiddleware, completeTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = {
  TaskRoutes: router,
};
