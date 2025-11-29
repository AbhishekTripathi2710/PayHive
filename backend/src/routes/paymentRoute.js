const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const paymentService = require("../services/paymentService");

router.post("/create-setup-intent",auth, async (req,res)  => {
    try{
        const {stripeCustomerId} = req.body;

        if(!stripeCustomerId){
            return res.status(400).json({message: "Stripe customer ID is required"});
        }

        const intent  = await paymentService.createSetupIntent(stripeCustomerId);
        res.json({
            clientSecret: intent.client_secret,
        });
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

router.post("/save-card",auth, async (req,res) => {
    try{
        const {paymentMethodId} = req.body;

        const saved = await paymentService.savePaymentMethod(req.user, paymentMethodId);

        res.json(saved);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
module.exports = router;