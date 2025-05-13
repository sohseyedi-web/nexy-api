const { verifyToken } = require("../utils/functions");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "دسترسی غیرمجاز. توکن موجود نیست." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("توکن نامعتبر:", error.message);
    return res.status(401).json({ message: "توکن نامعتبر است." });
  }
};

module.exports = authMiddleware;
