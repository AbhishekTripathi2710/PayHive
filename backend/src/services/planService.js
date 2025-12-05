const prisma = require("../prisma/client");
const slugify = require("slugify");

module.exports = {
  createPlan: async (data, user) => {
    const accountId = user.accountId;

    if (!data.name) throw new Error("Plan name is required");
    if (!data.billingCycle) throw new Error("Billing cycle is required");

    const priceMinor =
      data.priceMinor !== undefined
        ? Number(data.priceMinor)
        : Math.round(Number(data.price) * 100);

    if (isNaN(priceMinor) || priceMinor < 0)
      throw new Error("Invalid price");

    const code =
      slugify(data.name, { lower: true }) +
      "_" +
      data.billingCycle.toLowerCase();

    return await prisma.plan.create({
      data: {
        accountId,
        name: data.name,
        code,
        billingCycle: data.billingCycle,
        priceMinor,
        currency: data.currency || "INR",
        isMetered: Boolean(data.isMetered),
        description: data.description || null,
        active: true,
      },
    });
  },

  getPlans: async (accountId) => {
    return await prisma.plan.findMany({
      where: { accountId, active: true },
      orderBy: { id: "desc" },
    });
  },

  updatePlan: async (id, updates) => {
    const updateData = { ...updates };

    if (updates.priceMinor !== undefined) {
      const price = Number(updates.priceMinor);
      if (isNaN(price) || price < 0) throw new Error("Invalid priceMinor");
      updateData.priceMinor = price;
    }

    return await prisma.plan.update({
      where: { id: Number(id) },
      data: updateData,
    });
  },

  deletePlan: async (id) => {
    return await prisma.plan.update({
      where: { id: Number(id) },
      data: { active: false },
    });
  },
};
