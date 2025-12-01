const express = require("express");
const router = express.Router();
const stripe = require("../utils/stripe");
const webhookService = require("../services/webhookService");

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(" WEBHOOK SIGNATURE ERROR:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(" Webhook event received:", event.type);

  await webhookService.handleEvent(event);

  res.json({ received: true });
});


module.exports = router;
