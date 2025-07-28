const supabase = require("../config/supabase");

// Get all map pins
exports.getAllMapPins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_location_pins")
      .select(`
        id,
        latitude,
        longitude,
        location_name,
        user_id,
        users (id, first_name, last_name)
      `);

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = data.map(pin => ({
      id: pin.id,
      lat: pin.latitude,
      lng: pin.longitude,
      name: pin.location_name,
      userId: pin.user_id,
      users: pin.users
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single map pin by ID
exports.getMapPinById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_location_pins")
      .select(`
        id,
        latitude,
        longitude,
        location_name,
        user_id,
        users (id, first_name, last_name)
      `)
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Map pin not found" });
    }

    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      lat: data.latitude,
      lng: data.longitude,
      name: data.location_name,
      userId: data.user_id,
      users: data.users
    };

    res.status(200).json(transformedData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get all map pins for a specific user
exports.getUserMapPins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_location_pins")
      .select(`
        id,
        latitude,
        longitude,
        location_name,
        user_id
      `)
      .eq("user_id", req.params.userId);

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = data.map(pin => ({
      id: pin.id,
      lat: pin.latitude,
      lng: pin.longitude,
      name: pin.location_name,
      userId: pin.user_id
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new map pin
exports.createMapPin = async (req, res) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const lat = req.body.lat;
    const lng = req.body.lng;
    // const { userId, name, lat, lng } = req.body;

    // Validate required fields
    if (!userId || !name || lat === undefined || lng === undefined) {
      return res.status(400).json({
        error: "Missing required fields: userId, name, lat, and lng are required"
      });
    }

    // Validate latitude and longitude
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        error: "Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180"
      });
    }

    const { data, error } = await supabase
      .from("user_location_pins")
      .insert([{
        user_id: userId,
        location_name: name,
        latitude: lat,
        longitude: lng,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      lat: data.latitude,
      lng: data.longitude,
      name: data.location_name,
      userId: data.user_id
    };

    res.status(201).json(transformedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a map pin
exports.updateMapPin = async (req, res) => {
  try {
    const { name, lat, lng } = req.body;
    const updateData = {};

    // Only include fields that are provided
    if (name !== undefined) updateData.location_name = name;
    if (lat !== undefined) {
      if (lat < -90 || lat > 90) {
        return res.status(400).json({
          error: "Invalid latitude: must be between -90 and 90"
        });
      }
      updateData.latitude = lat;
    }
    if (lng !== undefined) {
      if (lng < -180 || lng > 180) {
        return res.status(400).json({
          error: "Invalid longitude: must be between -180 and 180"
        });
      }
      updateData.longitude = lng;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update"
      });
    }

    const { data, error } = await supabase
      .from("user_location_pins")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Map pin not found" });
    }

    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      lat: data.latitude,
      lng: data.longitude,
      name: data.location_name,
      userId: data.user_id
    };

    res.status(200).json(transformedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a map pin
exports.deleteMapPin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_location_pins")
      .delete()
      .eq("id", req.params.pinId)
      .eq("user_id", req.params.userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Map pin not found" });
    }

    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      lat: data.latitude,
      lng: data.longitude,
      name: data.location_name,
      userId: data.user_id
    };

    res.status(200).json({
      message: "Map pin deleted successfully",
      data: transformedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all map pins for a specific user
exports.deleteUserMapPins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_location_pins")
      .delete()
      .eq("user_id", req.params.userId)
      .select();

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = data.map(pin => ({
      id: pin.id,
      lat: pin.latitude,
      lng: pin.longitude,
      name: pin.location_name,
      userId: pin.user_id
    }));

    res.status(200).json({
      message: `Successfully deleted ${data.length} map pins for user`,
      data: transformedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};