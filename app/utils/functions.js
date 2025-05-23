const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.NEXT_AUTH_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  verifyToken,
  generateToken,
};
