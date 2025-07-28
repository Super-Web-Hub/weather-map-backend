const axios = require("axios");

const CALENDARIFIC_API_KEY = process.env.CALENDARIFIC_API_KEY; // Store your API key in an environment variable
const CALENDARIFIC_BASE_URL = "https://calendarific.com/api/v2/holidays";

// Fetch daily events from Calendarific API
exports.getDailyEvents = async (req, res) => {
  const { country, year, month, day } = req.query;

  try {
    // Validate required query parameters
    if (!country || !year || !month || !day) {
      return res.status(400).json({
        error: "Country, year, month, and day are required query parameters.",
      });
    }

    // Make a request to the Calendarific API
    const response = await axios.get(CALENDARIFIC_BASE_URL, {
      params: {
        api_key: CALENDARIFIC_API_KEY,
        country: country,
        year: year,
        month: month,
        day: day,
      },
    });

    // Extract the holidays/events data
    const events = response.data.response.holidays;

    // Return the events to the client
    res.status(200).json({
      message: "Daily events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error fetching daily events:", error);

    // Handle API errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error || "Error fetching data from Calendarific API",
      });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
};