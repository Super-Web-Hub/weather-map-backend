const cities = require("all-the-cities");

exports.getCities = (req, res) => {
  //   const { countryCode } = req.params;

  //   if (!countryCode) {
  //     return res.status(400).json({ error: "Country code is required" });
  //   }

  //   const filteredCities = cities
  //     .filter((city) => city.country === countryCode.toUpperCase())
  //     .map((city) => ({
  //       name: city.name,
  //       lat: city.loc.coordinates[1],
  //       lng: city.loc.coordinates[0],
  //       population: city.population,
  //     }))
  //     // .sort((a, b) => a.name.localeCompare(b.name));

  // //   console.log(filteredCities);
  //   res.json(filteredCities);

};
