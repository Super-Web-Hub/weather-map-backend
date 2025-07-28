const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection by querying a simple request
(async () => {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      console.error("Supabase connection error:", error.message);
    } else {
      console.log("Supabase connection successful.");
    }
  } catch (err) {
    console.error("Unexpected error during Supabase connection test:", err);
  }
})();

module.exports = supabase;
