// POST endpoint to log admin actions
export async function addLog(req, res) {
  const { admin, action, type, timestamp } = req.body;

  try {
    // Insert the log into the Supabase database
    const { data, error } = await supabase
      .from("audit_logs") // Replace 'logs' with your Supabase table name
      .insert([
        {
          admin,
          action,
          target,
          ip_address,
          serverity,
        },
      ]);

    if (error) {
      console.error("Error logging action:", error);
      return res.status(500).json({ message: "Failed to log action" });
    }

    res.status(201).json({ message: "Action logged successfully", data });
  } catch (error) {
    console.error("Unexpected error logging action:", error);
    res.status(500).json({ message: "Failed to log action" });
  }
}
// Get all logs
export async function getAllLogs(req, res) {
  try {
    const { data, error } = await supabase.from("audit_logs").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
}

// Get a specific log by ID
export async function getLogById(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching log:", error);
    res.status(500).json({ message: "Failed to fetch log" });
  }
}
