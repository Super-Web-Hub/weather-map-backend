const supabase = require("../config/supabase");

// Get all map controls
exports.getAllMapControls = async (req, res) => {
  try {
    const { data, error } = await supabase.from("map_controls").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get map controls for a specific user
exports.getUserMapControls = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("map_controls")
      .select("*")
      .eq("user_id", req.params.userId)
      .single();

    if (error) throw error;

    if (!data) {
      return res
        .status(404)
        .json({ error: "Map controls not found for this user" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update map controls for a specific user
exports.updateUserMapControls = async (req, res) => {
  try {
    const {
      time_zones,
      day_night,
      sun_moon,
      map_styles,
      time_24_form,
      about_app,
      weather,
      earthquakes,
      air_traffic,
    } = req.body;

    const updateData = {};
    
    // Only include fields that are provided
    if (time_zones !== undefined) updateData.time_zones = time_zones;
    if (day_night !== undefined) updateData.day_night = day_night;
    if (sun_moon !== undefined) updateData.sun_moon = sun_moon;
    if (map_styles !== undefined) updateData.map_styles = map_styles;
    if (time_24_form !== undefined) updateData.time_24_form = time_24_form;
    if (about_app !== undefined) updateData.about_app = about_app;
    if (weather !== undefined) updateData.weather = weather;
    if (earthquakes !== undefined) updateData.earthquakes = earthquakes;
    if (air_traffic !== undefined) updateData.air_traffic = air_traffic;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update",
      });
    }

    // First check if the user has map controls
    const { data: existingControls, error: checkError } = await supabase
      .from("map_controls")
      .select("id")
      .eq("user_id", req.params.userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") throw checkError;

    if (!existingControls) {
      // If no controls exist, create new ones with the provided data
      const newControls = {
        user_id: req.params.userId,
        ...updateData,
        created_at: new Date().toISOString(),
      };

      // Set defaults for required fields if not provided
      if (time_zones === undefined) newControls.time_zones = false;
      if (day_night === undefined) newControls.day_night = false;
      if (sun_moon === undefined) newControls.sun_moon = false;
      if (map_styles === undefined) newControls.map_styles = false;
      if (time_24_form === undefined) newControls.time_24_form = false;
      if (about_app === undefined) newControls.about_app = "";
      if (weather === undefined) newControls.weather = false;
      if (earthquakes === undefined) newControls.earthquakes = false;
      if (air_traffic === undefined) newControls.air_traffic = false;

      const { data: createdData, error: createError } = await supabase
        .from("map_controls")
        .insert([newControls])
        .select()
        .single();

      if (createError) throw createError;

      return res.status(201).json({
        message: "Map controls created for user",
        data: createdData,
      });
    }

    // Update existing controls
    const { data, error } = await supabase
      .from("map_controls")
      .update(updateData)
      .eq("user_id", req.params.userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: "Map controls updated successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
