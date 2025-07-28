const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: [
//       "https://admin-map-one.vercel.app",
//       "https://world-map-ionic-folw.vercel.app",
//     ], // ✅ only allow this frontend
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "*", // Allow multiple origins
    methods: "*", // Allow all HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", routes);
 
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
