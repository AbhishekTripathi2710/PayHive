const express = require("express");
const prisma = require("../prisma/client")
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

router.post("/:id/pause",auth, async (req,res) => {
    try{
        const {id} = req.params;
        const result = await subscriptionService.pauseSubscription({
            subscriptionId: id,
            user: req.user,
        });
        res.json(result);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

router.post("/:id/resume",auth, async (req,res) => {
    try{
        const {id} = req.params;
        const result = await subscriptionService.resumeSubscription({
            subscriptionId:id,
            user: req.user,
        });

        res.json(result);
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.post("/:id/usage",auth, async (req,res) => {
    try{
        const {id} = req.params;
        const {metric, quantity} = req.bodyl
        if (!metric || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ message: "metric and positive quantity required" });
        }

        const result = await subscriptionService.recordUsage({
            subscriptionId: Number(id),
            metric,
            quantity,
            user: req.user,
        });

        res.json({success: true, data: result});

    }catch (err) {
        console.error("recordUsage error:", err);
        res.status(err.statusCode || 400).json({ message: err.message });
    }
})

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(id) },
      include: {
        plan: true,
        user: true,
      },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.accountId !== req.user.accountId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ success: true, data: subscription });

  } catch (err) {
    console.error("GET /subscription/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id/usage", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const events = await subscriptionService.getUsageEvents({
      subscriptionId: Number(id),
      user: req.user,
    });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("getUsageEvents error:", err);
    res.status(err.statusCode || 400).json({ message: err.message });
  }
});

module.exports = router;