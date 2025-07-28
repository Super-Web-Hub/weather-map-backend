const supabase = require("../config/supabase");

// Get privacy policy data
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("privacy_policy")
      .select("*")
      .limit(1) // Ensure only one row is returned
      .single(); // Ensure the result is treated as a single object

    if (error) {
      console.error("Error fetching privacy policy data:", error);
      if (error.code === "PGRST116") {
        // No rows found
        return res.status(300).json({ message: "No privacy policy data found" });
      }
      return res.status(500).json({ error: "Failed to fetch privacy policy data" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching privacy policy data:", error);
    res.status(500).json({ error: error.message });
  }
};

// Save or update privacy policy data
exports.savePrivacyPolicy = async (req, res) => {
  try {
    // Check if the table already has a row
    const { data: existingData, error: fetchError } = await supabase
      .from("privacy_policy")
      .select("*")
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // If the error is not "No rows found", throw it
      throw fetchError;
    }

    let response;

    if (!existingData) {
      // If no row exists, create a new one
      const { data: createdData, error: createError } = await supabase
        .from("privacy_policy")
        .insert([
          {
            content: req.body.content,
            last_updated: req.body.lastUpdated,
          },
        ])
        .single();

      if (createError) throw createError;

      response = {
        message: "Privacy policy created successfully",
        data: createdData,
      };
    } else {
      // If a row exists, update it
      const { data: updatedData, error: updateError } = await supabase
        .from("privacy_policy")
        .update({
          content: req.body.content,
          last_updated: req.body.lastUpdated,
        })
        .eq("id", existingData.id)
        .single();

      if (updateError) throw updateError;

      response = {
        message: "Privacy policy updated successfully",
        data: updatedData,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error saving privacy policy data:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete privacy policy data
exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("privacy_policy")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.status(200).json({ message: "Privacy policy deleted successfully", data });
  } catch (error) {
    console.error("Error deleting privacy policy data:", error);
    res.status(500).json({ error: error.message });
  }
};