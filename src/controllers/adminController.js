const supabase = require("../config/supabase");
const path = require("path");
const bcrypt = require("bcrypt");

exports.getAdmins = async (req, res) => {
  try {
    const { data, error } = await supabase.from("admins").select("*");
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAdmin = async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, password, phone, confirmPassword, email } =
      req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Check if the phone number already exists
    const { data: existingPhone, error: phoneError } = await supabase
      .from("admins")
      .select("id")
      .eq("phone", phone)
      .single();

    if (phoneError && phoneError.code !== "PGRST116") {
      // Handle unexpected errors
      return res.status(400).json({ error: phoneError.message });
    }

    if (existingPhone) {
      return res.status(400).json({
        error: "A user with this phone number already exists. Please use a different phone number.",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = {
      first_name: firstName,
      last_name: lastName,
      password: hashedPassword,
      email,
      phone,
    };

    if (req.file) {
      const avatarPath = path.join("/uploads/avatars", req.file.filename);
      newAdmin.avatar = avatarPath; // Save avatar path in the database
    }

    // Create the user in Supabase Auth
    const userData = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
      },
    });

    if (userData.error) {
      if (userData.error.message.includes("User already registered")) {
        return res.status(400).json({
          error:
            "A user with this email already exists. Please use a different email.",
        });
      }
      return res.status(400).json({ error: userData.error.message });
    }

    // Insert the new admin into the "admins" table
    const { error: userError } = await supabase.from("admins").insert([newAdmin]);

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update Admin
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, password, phone, confirmPassword, email } =
    req.body;

  const updateData = {};

  updateData.first_name = firstName;
  updateData.last_name = lastName;
  updateData.password = password;
  updateData.phone = phone;
  updateData.email = email;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Step 1: Fetch the existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("admins")
      .select("password")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    // Step 2: Check if password exists and is different
    if (updateData.password && updateData.password !== existingUser.password) {
      // Optional: If passwords are hashed, use bcrypt.compare
      const isSame = await bcrypt.compare(
        updateData.password,
        existingUser.password
      );
      if (!isSame) {
        // Step 3: Hash the new password
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      } else {
        // Password is the same, don't rehash
        delete updateData.password;
      }
    }

    // Step 4: Update the user
    const { data, error } = await supabase
      .from("admins")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Admin updated successfully", user: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Delete Admin
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from("admins").delete().eq("id", id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get the file path
    const avatarPath = path.join("/uploads/avatars", req.file.filename);

    // Save the avatar path to the database (if associated with a user)
    // Example: Update the user's avatar in the database
    const userId = req.body.userId; // Assume userId is sent in the request body
    if (userId) {
      const { data, error } = await supabase
        .from("admins")
        .update({ avatar: avatarPath })
        .eq("id", userId);

      if (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    res
      .status(200)
      .json({ message: "Avatar uploaded successfully", avatar: avatarPath });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
