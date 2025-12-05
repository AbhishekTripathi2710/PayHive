const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const paymentService = require("../services/paymentService");
const prisma = require("../prisma/client");
const stripe = require("../utils/stripe");

async function ensureStripeCustomer(userFromJWT) {
    const user = await prisma.user.findUnique({
        where: { id: userFromJWT.userId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.stripeCustomerId) return user.stripeCustomerId;

    const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
    });

    return customer.id;
}

router.post("/create-setup-intent", auth, async (req, res) => {
    try {
        const stripeCustomerId = await ensureStripeCustomer(req.user);

        const intent = await paymentService.createSetupIntent(stripeCustomerId);

        res.json({
            clientSecret: intent.client_secret,
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/save-card", auth, async (req, res) => {
    try {
        const { paymentMethodId } = req.body;

        if (!paymentMethodId) {
            return res.status(400).json({ message: "Payment Method ID required" });
        }

        const saved = await paymentService.savePaymentMethod(req.user, paymentMethodId);

        res.json(saved);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/payment-methods", auth, async (req, res) => {
    try {
        const cards = await prisma.paymentMethod.findMany({
            where: {
                accountId: req.user.accountId,
                gateway: "stripe",
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ data: cards });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
