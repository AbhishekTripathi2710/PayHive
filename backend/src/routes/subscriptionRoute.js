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

router.post("/:id/cancel",auth, async (req,res) => {
    try{
        const {id} = req.params;
        const {immediate} = req.body;

        const result = await subscriptionService.cancelSubscription({
            subscriptionId: id,
            immediate: immediate || false,
            user: req.user,
        });

        res.json(result);
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.post("/:id/change-plan", auth, async (req,res) => {
    try{
        const {id} = req.params;
        const {newPlanId} = req.body;

        const result = await subscriptionService.changePlan({
            subscriptionId: id,
            newPlanId,
            user: req.user
        });

        res.json(result);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

module.exports = router;