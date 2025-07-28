const supabase = require("../config/supabase");

// Create a new setting
exports.createSetting = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings") // Replace 'settings' with your Supabase table name
      .insert(req.body);

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all settings
exports.getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single(); // Fetch the single row

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single setting by ID
exports.getSettingById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings") // Replace 'settings' with your Supabase table name
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update a setting by ID
exports.updateSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update(req.body)
      .eq("id", 1); // Assuming the single settings row has an ID of 1

    if (error) throw error;

    res.status(200).json({
      message: "Settings updated successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a setting by ID
exports.deleteSetting = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings") // Replace 'settings' with your Supabase table name
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.status(200).json({ message: "Setting deleted successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const path = require("path");

exports.uploadSiteIcon = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get the file path
    const siteIconPath = path.join("/uploads/icon", req.file.filename);

    // Update the site_icon path in the single settings row
    const { data, error } = await supabase
      .from("settings")
      .update({ site_icon: siteIconPath })
      .eq("id", 1); // Assuming the single settings row has an ID of 1

    if (error) {
      console.error("Error updating site icon in database:", error);
      return res
        .status(400)
        .json({ error: "Failed to update site icon in the database." });
    }

    // Respond with success
    res.status(200).json({
      message: "Site icon uploaded successfully",
      site_icon: siteIconPath,
      data,
    });
  } catch (err) {
    console.error("Error uploading site icon:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
