const axios = require("axios");

exports.getLiveWeatherData = (req, res) => {
  const url =
    "http://api.tomorrow.io/v4/map/tile/5/2/3/precipitationIntensity/now.png?apikey=lNXs2aO96Wfna4bkPJLAACvuV9CCFNxO";

  try {
    // Fetch the image data as a stream
    axios
      .get(url, {
        responseType: "arraybuffer", // Fetch binary data
        // headers: {
        //   accept: "image/png", // Accept PNG images
        //   "accept-encoding": "deflate, gzip, br",
        // },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // Set the appropriate headers for the response
    // res.set("Content-Type", "image/png");

    // // Send the binary data to the client
    // res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching live weather data:", error);

    // Handle errors and send an appropriate response
    res.status(500).json({
      error: "Failed to fetch live weather data",
      details: error.message,
    });
  }
};

exports.getEarthQuakeData = (req, res) => {};

exports.getAirTrafficData = (req, res) => {};

exports.getMaritimeTrafficData = (req, res) => {};
