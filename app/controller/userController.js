const { User } = require("../models/User");
const { generateToken } = require("../utils/functions");

const login = async (req, res, next) => {
  const { name, email, image, provider } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        imageGoogle: provider === "google" ? image : "",
        imageGitHub: provider === "github" ? image : "",
      });
    } else {
      if (provider === "google") user.imageGoogle = image;
      if (provider === "github") user.imageGitHub = image;
    }

    await user.save();
    const token = generateToken({ _id: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

module.exports = {
  login,
  logout,
};
