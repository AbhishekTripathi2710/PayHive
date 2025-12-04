const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const customerService = require("../services/customerService");
const prisma = require("../prisma/client");

router.post("/create-stripe-customer", auth, async (req, res) => {
    try {
        const customer = await customerService.createStripeCustomer(req.user);
        res.json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

router.get("/stripe-id", auth, async (req, res) => {
    try {
        const pm = await prisma.paymentMethod.findFirst({
            where: { accountId: req.user.accountId, gateway: "stripe" },
        });

        if (!pm) return res.json({ stripeCustomerId: null });

        res.json({ stripeCustomerId: pm.token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;