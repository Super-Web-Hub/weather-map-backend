const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "missing required params" });
  }

  try {
    const { data: user, error: userError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found." });
    }

    // const isMatch = await bcrypt.compare(password, user.password);

    const isMatch = true;

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      token, // Return the token
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

exports.registerUser = async (req, res) => {
  console.log("Registering user with data:", req.body);

  const { firstName, lastName, password, email, phone } = req.body;

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({
      error: "First name, last name, email and password are required.",
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // First create the user in Supabase Auth
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

    if (!!userData.error) {
      return res.status(400).json({ error: userData.error });
    }

    // Then store additional user data in admins table
    const { error: userError } = await supabase.from("admins").insert([
      {
        id: userData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone,
      },
    ]);

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    res.status(200).json({
      message: "User registered successfully",
      user: {
        id: userData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`, // URL where the user will reset their password
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message:
        "Password reset email sent successfully. Please check your inbox.",
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params; // Assuming the user ID is passed as a route parameter

  if (!id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Fetch the user from the "users" table
    const { data: user, error } = await supabase
      .from("admins")
      .select("id, email, first_name, last_name, avatar")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};
exports.updateUser = async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is extracted from the JWT token
  const { firstName, lastName, email, phone, password, confirmPassword } =
    req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Check if passwords match (if password is being updated)
    // if (password !== "" && password !== confirmPassword) {
    //   return res.status(400).json({ error: "Passwords do not match." });
    // }

    const updateData = {};

    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    // Hash the password if it's being updated
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    // Update the user in the "admins" table
    const { data, error } = await supabase  
      .from("admins")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Generate a new JWT token with updated user data
    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar: data.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User updated successfully",
      token, // Return the new token
      user: data,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};
