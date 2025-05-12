const express = require("express");
const { TaskRoutes } = require("./task");
const { userAuthRoutes } = require("./user");
const { BoxRoutes } = require("./box");
const router = express.Router();

router.use("/task", TaskRoutes);
router.use("/boxes", BoxRoutes);
router.use("/auth", userAuthRoutes);

module.exports = router;
