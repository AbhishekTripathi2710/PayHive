const prisma = require("../prisma/client");
const slugify = require("slugify");

module.exports = {
  createPlan: async (data, user) => {
    const accountId = user.accountId;

    const code =
      slugify(data.name, { lower: true }) +
      "_" +
      data.billingCycle.toLowerCase();

    const priceMinor = Math.round(data.price * 100);

    return await prisma.plan.create({
      data: {
        accountId,
        name: data.name,
        code,
        billingCycle: data.billingCycle,
        priceMinor: priceMinor,
        currency: data.currency || "INR",
        isMetered: data.isMetered || false,
      },
    });
  },

  getPlans: async (accountId) => {
    return await prisma.plan.findMany({
      where: { accountId },
    });
  },

  updatePlan: async (id, updates) => {
    return await prisma.plan.update({
      where: { id },
      data: updates,
    });
  },

  deletePlan: async (id) => {
    return await prisma.plan.update({
      where: { id },
      data: { active: false },
    });
  },
};
