const express = require("express");
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
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Farmers Portal API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmers", farmerRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

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
