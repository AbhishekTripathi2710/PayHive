const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const customerService = require("../services/customerService");

router.post("/create-stripe-customer",auth, async (req,res) => {
    try{
        const customer =await customerService.createStripeCustomer(req.user);
        res.json(customer);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

module.exports = router;