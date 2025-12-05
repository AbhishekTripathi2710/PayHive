const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const walletService = require("../services/walletService");

router.get("/me", auth, async (req,res) => {
    try{
        const data = await walletService.getWallet(req.user.accountId);
        res.json({success: true, data});
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

router.post("/credit",auth, async (req,res) => {
    try{
        const {amountMinor, description} = req.body;

        const data = await walletService.credit({
            accountId: req.user.accountId,
            amountMinor,
            description: description || "Manula credit",
        });
        
        res.json({success: true, data});
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.post("/debit",auth,async (req,res) => {
    try{
        const { amountMinor, description} = req.body;

        const data = await walletService.debit({
            accountId: req.user.accountId,
            amountMinor,
            description: description || "Manual debit",
        });

        res.json({success: true, data});
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router;