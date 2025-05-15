const express = require("express");
const {
  createBox,
  getBoxes,
  inviteBox,
  deleteBoxes,
  deleteMemberBoxes,
  getMembersBoxes,
} = require("../controller/boxController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getBoxes);
router.post("/create", authMiddleware, createBox);
router.post("/invite/:id", authMiddleware, inviteBox);
router.get("/members/:id", authMiddleware, getMembersBoxes);
router.delete("/members/:id", authMiddleware, deleteMemberBoxes);
router.delete("/:id", authMiddleware, deleteBoxes);

module.exports = {
  BoxRoutes: router,
};
