const planService = require("../services/planService");

module.exports = {
  create: async (req, res) => {
    try {
        // console.log("USER FROM AUTH:", req.user);
      const plan = await planService.createPlan(req.body, req.user);
      res.json(plan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const plans = await planService.getPlans();
      res.json(plans);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await planService.updatePlan(id, req.body);
      res.json(plan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await planService.deletePlan(id);
      res.json({ message: "Plan archived", plan });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
 