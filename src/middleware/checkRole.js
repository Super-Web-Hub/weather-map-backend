const supabase = require("../config/supabase");

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const { userId } = req.body; // Assume userId is passed in the request body
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (data.role !== requiredRole) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = checkRole;
