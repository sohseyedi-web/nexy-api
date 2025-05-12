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
router.delete("/:id", authMiddleware, deleteBoxes);
router.post("/:id/invite", authMiddleware, inviteBox);
router.get("/:id/members", authMiddleware, getMembersBoxes);
router.delete("/:id/members/:userId", authMiddleware, deleteMemberBoxes);

module.exports = {
  BoxRoutes: router,
};
