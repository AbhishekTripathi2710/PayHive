const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const subscriptionService = require("../services/subscriptionService");

router.post("/",auth,async (req,res) => {
    try{
        const {planId, paymentMethodId} = req.body;
        const result = await subscriptionService.createSubscription({user: req.user, planId, paymentMethodId});
        res.json(result);
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router;