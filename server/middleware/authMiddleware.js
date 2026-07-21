const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

// Verifies the JWT sent in the Authorization header and attaches
// the logged-in employee (minus password) to req.user
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employee = await Employee.findById(decoded.id).select("-password");

    if (!employee) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = employee;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Must be used after `protect`. Restricts a route to admins only.
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, admin only" });
};

module.exports = { protect, isAdmin };
