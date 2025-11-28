const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth",authRoutes);

app.get("/",(req,res) => res.send("Billing API running..."));

module.exports = app;
