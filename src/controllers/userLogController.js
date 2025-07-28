const supabase = require("../config/supabase");

// Create a new log entry
exports.createLog = async (req, res) => {
  const { user_id, action, ip_address, device_type } = req.body;

  try {
    // Validate required fields
    if (!user_id || !action || !ip_address || !device_type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Insert the log into the database
    const { data: newLog, error } = await supabase
      .from("user_logs")
      .insert([{ user_id, action, ip_address, device_type }])
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Log created successfully", data: newLog });
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all logs
exports.getLogs = async (req, res) => {
  try {
    // Fetch all logs from the database
    const { data: logs, error } = await supabase
      .from("user_logs")
      .select("id, timestamp, user_id, action, ip_address, device_type");

    if (error) throw error;

    res.status(200).json({ message: "Logs fetched successfully", data: logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: error.message });
  }
};