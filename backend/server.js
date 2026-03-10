const moodRoutes = require("./routes/moodRoutes");
const PORT = process.env.PORT || 5000;
const ventRoutes = require("./routes/ventRoutes");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.use("/api/vent", ventRoutes);

app.use("/api/mood", moodRoutes);

app.get("/", (req, res) => {
  res.send("CampusMind API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});