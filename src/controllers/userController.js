const supabase = require("../config/supabase");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // For generating tokens

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Fetch all users and their subscription data
    const { data, error } = await supabase.from("users").select(`
        *,
        user_subscriptions (
          plan_id,
          start_date,
          status,
          plans (
            name,
            price,
            billing_cycle
          )
        )
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Ensure user_subscriptions is treated as an object for each user
    const users = data.map((user) => {
      if (user.user_subscriptions && Array.isArray(user.user_subscriptions)) {
        user.user_subscriptions = user.user_subscriptions[0] || null;
      }
      return user;
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a user by ID
exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the user and their subscription data
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        user_subscriptions (
          plan_id,
          start_date,
          status,
          plans (
            name,
            price,
            billing_cycle
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }

    // Ensure user_subscriptions is treated as an object
    if (data.user_subscriptions && Array.isArray(data.user_subscriptions)) {
      data.user_subscriptions = data.user_subscriptions[0] || null;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      sendInvite,
      requirePasswordChange,
      firstName,
      lastName,
      password,
      confirmPassword,
      role,
      ...newUser
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare the new user object
    newUser.send_invite = sendInvite;
    newUser.require_password_change = requirePasswordChange;
    newUser.first_name = firstName;
    newUser.last_name = lastName;
    newUser.password = hashedPassword;

    // Insert the new user into the "users" table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([newUser])
      .select()
      .single();

    if (userError) {
      console.log(userError);
      if (userError.message.includes("users_phone_number_key")) {
        return res.status(400).json({
          error:
            "A user with this phone number already exists. Please use a different phone number.",
        });
      } else if (userError.message.includes("users_email_key")) {
        return res.status(400).json({
          error:
            "A user with this email already exists. Please use a different email.",
        });
      }
    }

    // Assign the default subscription plan ("Free Plan") to the new user
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id")
      .eq("name", "Free Plan")
      .single();

    if (planError || !plan) {
      console.error("Error fetching default plan:", planError);
      return res.status(400).json({
        error: "Failed to assign the default subscription plan.",
      });
    }

    const currentTime = new Date().toISOString();

    const { error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: userData.id,
        plan_id: plan.id,
        start_date: currentTime,
      });

    if (subscriptionError) {
      console.error("Error assigning subscription:", subscriptionError);
      return res.status(400).json({
        error: "Failed to assign the default subscription plan.",
      });
    }

    res.status(201).json({
      message: "User created successfully with default subscription plan.",
      user: userData,
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a user by ID

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    requirePasswordChange,
    sendInvite,
    password,
    // confirmPassword,
    subscriptionPlanName, // Optional: Update subscription plan,
    subscription_plan,
    ...updateData
  } = req.body;

  // Map fields to match database column names
  updateData.first_name = firstName;
  updateData.last_name = lastName;
  updateData.require_password_change = requirePasswordChange;
  updateData.send_invite = sendInvite;

  try {
    // Step 1: Fetch the existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Step 2: Validate and hash the password if it is being updated
    if (password) {
      // if (password !== confirmPassword) {
      //   return res.status(400).json({ error: "Passwords do not match." });
      // }

      const isSame = await bcrypt.compare(password, existingUser.password);
      if (!isSame) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      } else {
        // Password is the same, don't rehash
        delete updateData.password;
      }
    }

    // Step 3: Update the user's subscription plan if provided
    let subscriptionPlan = null;
    if (subscriptionPlanName) {
      // Fetch the new subscription plan
      const { data: plan, error: planError } = await supabase
        .from("plans")
        .select("id, name")
        .eq("name", subscriptionPlanName)
        .single();

      if (planError || !plan) {
        return res.status(400).json({
          error: `Failed to find the subscription plan: ${subscriptionPlanName}.`,
        });
      }

      // Update the user's subscription
      const currentTime = new Date().toISOString();
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .update({
          plan_id: plan.id,
          start_date: currentTime,
        })
        .eq("user_id", id);

      if (subscriptionError) {
        console.error("Error updating subscription:", subscriptionError);
        return res.status(400).json({
          error: "Failed to update the subscription plan.",
        });
      }

      // Set the subscription plan for the response
      subscriptionPlan = {
        id: plan.id,
        name: plan.name,
        start_date: currentTime,
      };
    }

    // Step 4: Update the user in the "users" table
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Step 5: Format the response data
    const responseData = {
      avatar: updatedUser.avatar || "",
      created_at: updatedUser.created_at,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      location: updatedUser.location,
      phone: updatedUser.phone,
      status: updatedUser.status,
      subscriptionPlanName:
        subscriptionPlanName || existingUser.subscriptionPlanName,
      subscription_plan: subscriptionPlan ? [subscriptionPlan] : [],
      type: updatedUser.type,
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a user by email
// exports.getUserByEmail = async (req, res) => {
//   const { email } = req.params;
//   try {
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();
//     if (error) {
//       return res.status(404).json({ error: error.message });
//     }
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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
        .from("users")
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

// User login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Fetch the user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Return the token and user data
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
