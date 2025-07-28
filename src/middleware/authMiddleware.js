const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
