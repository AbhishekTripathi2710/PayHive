const planService = require("../services/planService");

module.exports = {
  create: async (req, res) => {
    try {
      const plan = await planService.createPlan(req.body, req.user);
      res.json({ success: true, data: plan });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const plans = await planService.getPlans(req.user.accountId);
      res.json({ success: true, data: plans });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await planService.updatePlan(id, req.body);

      res.json({ success: true, data: plan });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await planService.deletePlan(id);

      res.json({
        success: true,
        message: "Plan archived successfully",
        data: plan,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
