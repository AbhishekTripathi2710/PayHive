const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const planRoutes = require("./routes/planRoute")
const customerRoutes = require("./routes/customerRoute");
const paymentRoutes = require("./routes/paymentRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth",authRoutes);
app.use("/plans",planRoutes)
app.use("/customer",customerRoutes);
app.use("/payment",paymentRoutes);

app.get("/",(req,res) => res.send("Billing API running..."));

module.exports = app;
