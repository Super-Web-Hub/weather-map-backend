const supabase = require("../config/supabase");

// Get all timezone configurations
exports.getConfigurations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_timezone_configurations")
      .select(`
        *,
        users (id, first_name, last_name)
      `);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single timezone configuration
exports.getConfiguration = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_timezone_configurations")
      .select(`
        *,
        users (id, first_name, last_name)
      `)
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get timezone configuration by user ID
exports.getUserConfiguration = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_timezone_configurations")
      .select(`
        *,
        users (id, first_name, last_name)
      `)
      .eq("user_id", req.params.userId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Configuration not found for this user" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Create a new timezone configuration
exports.createConfiguration = async (req, res) => {
  try {
    const { user_id, timezone, time_format } = req.body;

    // Validate required fields
    if (!user_id || !timezone || !time_format) {
      return res.status(400).json({ 
        error: "Missing required fields: user_id, timezone, and time_format are required" 
      });
    }

    // Check if configuration already exists for this user
    const { data: existingConfig } = await supabase
      .from("user_timezone_configurations")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (existingConfig) {
      return res.status(400).json({ 
        error: "A timezone configuration already exists for this user" 
      });
    }

    const { data, error } = await supabase
      .from("user_timezone_configurations")
      .insert([{
        user_id,
        timezone,
        time_format,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a timezone configuration
exports.updateConfiguration = async (req, res) => {
  try {
    const { timezone, time_format } = req.body;
    const updateData = {};

    // Only include fields that are provided
    if (timezone !== undefined) updateData.timezone = timezone;
    if (time_format !== undefined) updateData.time_format = time_format;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: "No valid fields provided for update" 
      });
    }

    const { data, error } = await supabase
      .from("user_timezone_configurations")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a timezone configuration
exports.deleteConfiguration = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_timezone_configurations")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Configuration not found" });
    }

    res.status(200).json({ 
      message: "Configuration deleted successfully",
      data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};