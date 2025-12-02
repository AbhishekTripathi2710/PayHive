const prisma = require("../prisma/client");

module.exports = {
  // 1) Subscriptions list
  listSubscriptions: async (accountId) => {
    return prisma.subscription.findMany({
      where: { accountId },
      include: {
        plan: true,
        user: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  getSubscription: async (id, accountId) => {
    return prisma.subscription.findFirst({
      where: { id: Number(id), accountId },
      include: {
        plan: true,
        invoices: true,
        usageEvents: {
          orderBy: { eventTimestamp: "desc" }
        },
      },
    });
  },

  listInvoices: async (accountId) => {
    return prisma.invoice.findMany({
      where: { accountId },
      include: {
        subscription: { include: { plan: true } },
      },
      orderBy: { createdAt: "desc" }
    });
  },

  getInvoice: async (id, accountId) => {
    return prisma.invoice.findFirst({
      where: { id: Number(id), accountId },
      include: {
        subscription: true,
        lineItems: true,
        payments: true
      }
    });
  },

  
  listPayments: async (accountId) => {
    return prisma.payment.findMany({
      where: { accountId },
      include: {
        invoice: {
          include: { subscription: true }
        },
        paymentMethod: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  
  listPlans: async (accountId) => {
    return prisma.plan.findMany({
      where: { accountId, active: true },
      orderBy: { createdAt: "desc" }
    });
  },

  
  summary: async (accountId) => {
    const [
      activeSubsCount,
      totalRevenue,
      wallet,
      mrr,
      pastDueCount
    ] = await Promise.all([
      prisma.subscription.count({
        where: { accountId, status: "active" }
      }),

      prisma.payment.aggregate({
        where: { accountId, status: "succeeded" },
        _sum: { amountMinor: true }
      }),

      prisma.wallet.findFirst({ where: { accountId } }),

      prisma.subscription.count({
        where: { accountId, status: "active" }
      }),

      prisma.subscription.count({
        where: { accountId, status: "past_due" }
      }),
    ]);

    return {
      activeSubscriptions: activeSubsCount,
      totalRevenueMinor: totalRevenue._sum.amountMinor ?? 0,
      walletBalanceMinor: wallet?.balanceMinor ?? 0,
      mrr: mrr * 1000, 
      pastDueSubscriptions: pastDueCount,
    };
  }
};