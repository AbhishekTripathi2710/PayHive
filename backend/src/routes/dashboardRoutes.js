const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const dashboardService = require("../services/dashboardService");

router.get("/subscriptions", auth, async (req, res) => {
  const data = await dashboardService.listSubscriptions(req.user.accountId);
  res.json({ success: true, data });
});

router.get("/subscriptions/:id", auth, async (req, res) => {
  const data = await dashboardService.getSubscription(req.params.id, req.user.accountId);
  res.json({ success: true, data });
});

router.get("/invoices", auth, async (req, res) => {
  const data = await dashboardService.listInvoices(req.user.accountId);
  res.json({ success: true, data });
});

router.get("/invoices/:id", auth, async (req, res) => {
  const data = await dashboardService.getInvoice(req.params.id, req.user.accountId);
  res.json({ success: true, data });
});

router.get("/payments", auth, async (req, res) => {
  const data = await dashboardService.listPayments(req.user.accountId);
  res.json({ success: true, data });
});

router.get("/plans", auth, async (req, res) => {
  const data = await dashboardService.listPlans(req.user.accountId);
  res.json({ success: true, data });
});

router.get("/summary", auth, async (req, res) => {
  const data = await dashboardService.summary(req.user.accountId);
  res.json({ success: true, data });
});

module.exports = router;