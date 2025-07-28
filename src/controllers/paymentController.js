const supabase = require("../config/supabase");

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments") // Replace 'payments' with your Supabase table name
      .insert(req.body);

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments") // Replace 'payments' with your Supabase table name
      .select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments") // Replace 'payments' with your Supabase table name
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments") // Replace 'payments' with your Supabase table name
      .update(req.body)
      .eq("id", req.params.id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments") // Replace 'payments' with your Supabase table name
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.status(200).json({ message: "Payment deleted successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
