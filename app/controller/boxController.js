const { Box } = require("../models/Box");
const { Task } = require("../models/Task");
const { User } = require("../models/User");

async function createBox(req, res) {
  const { name } = req.body;
  const owner = req.user;

  try {
    const box = new Box({
      name,
      owner: owner._id,
      members: [owner._id],
    });

    await box.save();
    await box.populate("owner", "name email");

    res.status(201).json(box);
  } catch (err) {
    res.status(500).json({
      message: "Box creation failed",
      error: err.message,
    });
  }
}

async function inviteBox(req, res) {
  const { email } = req.body;
  const boxId = req.params.id;
  const owner = req.user;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (box.owner.toString() !== owner._id.toString()) {
      return res.status(403).json({ message: "Only owner can invite members" });
    }

    const isAlreadyMember = box.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );

    if (!isAlreadyMember) {
      box.members.push(user._id);
      await box.save();
    }

    res.status(200).json({ message: "User invited to box" });
  } catch (err) {
    res.status(500).json({ message: "Invitation failed", error: err.message });
  }
}

async function getBoxes(req, res) {
  const user = req.user;

  try {
    const boxes = await Box.find({ members: user._id })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json(boxes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching boxes failed", error: err.message });
  }
}

async function deleteBoxes(req, res) {
  const boxId = req.params.id;
  const owner = req.user;

  try {
    const box = await Box.findById(boxId);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (box.owner.toString() !== owner._id.toString()) {
      return res.status(403).json({ message: "Only owner can delete box" });
    }

    await Task.deleteMany({ box: boxId });
    await Box.findByIdAndDelete(boxId);

    res.status(200).json({ message: "Box and related tasks deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete box", error: err.message });
  }
}

async function getMembersBoxes(req, res) {
  try {
    const box = await Box.findById(req.params.id).populate(
      "members",
      "name email image"
    );

    if (!box) return res.status(404).json({ message: "Box not found" });

    return res.json({ members: box.members });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

async function deleteMemberBoxes(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const owner = req.user;

    const box = await Box.findById(id);
    if (!box) return res.status(404).json({ message: "Box not found" });

    if (box.owner.toString() !== owner._id.toString()) {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    if (userId === owner._id.toString()) {
      return res.status(400).json({ message: "Owner cannot be removed" });
    }

    box.members = box.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await box.save();

    return res.json({ message: "Member removed" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getBoxes,
  inviteBox,
  createBox,
  deleteBoxes,
  getMembersBoxes,
  deleteMemberBoxes,
};
