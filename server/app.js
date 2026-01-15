const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { connect } = require("./config/database");
const Role = require("./models/Role");
const User = require("./models/User");
const Farmer = require("./models/Farmer");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const farmerRoutes = require("./routes/farmers");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static client files
app.use("/client", express.static(path.join(__dirname, "../client")));
app.get("/", (req, res) => {
  res.send("Farmers Portal API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmers", farmerRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
