const supabase = require("../config/supabase");

exports.getPlan = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the plan
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", id)
      .single();

    if (planError || !plan) {
      return res.status(404).json({ error: "Plan not found." });
    }

    // Fetch the features for the plan
    const { data: features, error: featureError } = await supabase
      .from("plan_features")
      .select("id, name, included")
      .eq("plan_id", id);

    if (featureError) {
      console.error("Error fetching features:", featureError);
      return res.status(400).json({ error: "Failed to fetch plan features." });
    }

    // Combine the plan and its features
    plan.features = features || [];

    res.status(200).json({
      message: "Plan retrieved successfully",
      plan,
    });
  } catch (err) {
    console.error("Error in getPlan:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    // Fetch all plans
    const { data: plans, error: plansError } = await supabase
      .from("plans")
      .select("*");

    if (plansError) {
      return res.status(400).json({ error: plansError.message });
    }

    // Fetch all features
    const { data: features, error: featuresError } = await supabase
      .from("plan_features")
      .select("*");

    if (featuresError) {
      return res.status(400).json({ error: featuresError.message });
    }

    // Map features to their respective plans
    const plansWithFeatures = plans.map((plan) => {
      plan.features = features.filter((feature) => feature.plan_id === plan.id);
      return plan;
    });

    res.status(200).json(plansWithFeatures);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createPlan = async (req, res) => {
  const { name, price, color, billingCycle, features } = req.body;

  try {
    // Validate features array
    if (!features || !Array.isArray(features) || features.length === 0) {
      return res
        .status(400)
        .json({ error: "Features array is required and cannot be empty." });
    }

    // Insert the plan into the "plans" table
    const { data: planData, error: planError } = await supabase
      .from("plans")
      .insert({
        name,
        price,
        color,
        billing_cycle: billingCycle,
      })
      .select()
      .single();

    if (planError) {
      console.log("Plan Error:", planError);
      return res.status(400).json({ error: planError.message });
    }

    console.log("Plan Data:", planData);

    // Insert features into the "plan_features" table
    const featureRows = features.map((feature) => ({
      plan_id: planData.id, // Ensure planData.id is valid
      name: feature.name,
      included: feature.included,
    }));

    const { error: featureError } = await supabase
      .from("plan_features")
      .insert(featureRows);

    if (featureError) {
      console.log("Feature Insertion Error:", featureError);
      return res.status(400).json({ error: featureError.message });
    }

    res.status(200).json({
      message: "Plan created successfully",
      plan: planData,
    });
  } catch (err) {
    console.error("Error in createPlan:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, color, billingCycle, features, popular } = req.body;

  try {
    // Update the plan in the "plans" table
    const { data: updatedPlan, error: planError } = await supabase
      .from("plans")
      .update({
        name,
        description,
        price,
        color,
        billing_cycle: billingCycle,
        popular,
      })
      .eq("id", id)
      .select()
      .single();

    if (planError) {
      console.error("Error updating plan:", planError);
      return res.status(400).json({ error: planError.message });
    }

    // If features are provided, update the "plan_features" table
    if (features && Array.isArray(features)) {
      // Delete existing features for the plan
      const { error: deleteError } = await supabase
        .from("plan_features")
        .delete()
        .eq("plan_id", id);

      if (deleteError) {
        console.error("Error deleting old features:", deleteError);
        return res.status(400).json({ error: deleteError.message });
      }

      // Insert the updated features
      const featureRows = features.map((feature) => ({
        plan_id: id,
        name: feature.name,
        included: feature.included,
      }));

      const { error: featureError } = await supabase
        .from("plan_features")
        .insert(featureRows);

      if (featureError) {
        console.error("Error inserting updated features:", featureError);
        return res.status(400).json({ error: featureError.message });
      }
    }

    res.status(200).json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (err) {
    console.error("Error in updatePlan:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete associated features from the "plan_features" table
    const { error: featureError } = await supabase
      .from("plan_features")
      .delete()
      .eq("plan_id", id);

    if (featureError) {
      console.error("Error deleting plan features:", featureError);
      return res.status(400).json({ error: "Failed to delete plan features." });
    }

    // Delete the plan from the "plans" table
    const { data, error: planError } = await supabase
      .from("plans")
      .delete()
      .eq("id", id);

    if (planError) {
      console.error("Error deleting plan:", planError);
      return res.status(400).json({ error: "Failed to delete the plan." });
    }

    res.status(200).json({ message: "Plan and its features deleted successfully." });
  } catch (err) {
    console.error("Error in deletePlan:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPlanFeatures = async (req, res) => {
  // const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("plan_features")
      .select("*")
      .eq("plan_id", id);
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
