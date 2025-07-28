const supabase = require("../config/supabase");

// Get contact data
exports.getContactData = async (req, res) => {
  const { data, error } = await supabase
    .from("contact_info")
    .select("*")
    .limit(1) // Ensure only one row is returned
    .single(); // Ensure the result is treated as a single object

  if (error) {
    console.error("Error fetching contact data:", error);
    if(error.code === "PGRST116") {
      // No rows found
      return res.status(404).json({ message: "No contact data found" });
    }
    return res.status(500).json({ error: "Failed to fetch contact data" });
  }else{
    return res.status(200).json(data);
  }
};

// Update contact data
exports.updateContactData = async (req, res) => {
  try {
    // Check if the table already has a row
    const { data: existingData, error: fetchError } = await supabase
      .from("contact_info")
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
        .from("contact_info")
        .insert([req.body])
        .single();

      if (createError) throw createError;

      response = {
        message: "Contact data created successfully",
        data: createdData,
      };
    } else {
      // If a row exists, update it
      const { data: updatedData, error: updateError } = await supabase
        .from("contact_info")
        .update(req.body)
        .eq("id", existingData.id)
        .single();

      if (updateError) throw updateError;

      response = {
        message: "Contact data updated successfully",
        data: updatedData,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating contact data:", error);
    res.status(400).json({ error: error.message });
  }
};

// Create contact data (only needed if the row doesn't exist)
exports.createContactData = async (req, res) => {
  try {
    const { data, error } = await supabase.from("contact_info").insert([
      {
        heading: "Get in Touch",
        subheading:
          "Have questions or need assistance? We're here to help. Fill out the form below or use our contact information.",
        form_heading: "Send us a Message",
        form_subheading:
          "Fill out the form below and we'll get back to you as soon as possible.",
        contact_heading: "Contact Information",
        contact_subheading:
          "Reach out to us directly using the information below.",
        emails: ["support@niceadmin.com", "info@niceadmin.com"],
        phones: ["+1 (555) 123-45", "+1 (555) 987-65"],
        address: {
          street: "123 Admin Street",
          city: "Dashboard City",
          country: "United States",
        },
        business_hours: {
          heading: "Business Hours",
          subheading: "When you can reach our support team.",
          hours: [
            { day: "Monday - Friday", time: "9:00 AM - 6:00 PM EST" },
            { day: "Saturday", time: "10:00 AM - 4:00 PM EST" },
            { day: "Sunday", time: "Closed" },
          ],
        },
      },
    ]);
    if (error) throw error;

    res.status(201).json({
      message: "Contact data created successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
