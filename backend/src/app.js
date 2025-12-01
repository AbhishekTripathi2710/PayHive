const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const planRoutes = require("./routes/planRoute")
const customerRoutes = require("./routes/customerRoute");
const paymentRoutes = require("./routes/paymentRoute");
const subscriptionRoutes = require("./routes/subscriptionRoute");
const webhookRoute = require("./routes/webhookRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth",authRoutes);
app.use("/plans",planRoutes)
app.use("/customer",customerRoutes);
app.use("/payment",paymentRoutes);
app.use("/subscription",subscriptionRoutes);
app.use("/webhook/stripe",webhookRoute);

app.get("/",(req,res) => res.send("Billing API running..."));

module.exports = app;
