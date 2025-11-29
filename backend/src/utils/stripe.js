const Stripe = require("stripe");

module.exports = new Stripe(process.env.STRIPE_SECRET_KEY,{
    apiVersion: "2023-10-16",
})