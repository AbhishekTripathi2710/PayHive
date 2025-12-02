const prisma = require("../prisma/client");

const walletService = {

  getWallet: async (accountId) => {
    let wallet = await prisma.wallet.findFirst({
      where: { accountId },
      include: { transactions: { orderBy: { createdAt: "desc" } } },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { accountId },
      });
    }

    return wallet;
  },

  credit: async ({ accountId, amountMinor, description = "Credit" }) => {
    if (amountMinor <= 0) throw new Error("Amount must be positive");

    let wallet = await prisma.wallet.findFirst({ where: { accountId } });

    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { accountId } });
    }

    const tx = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amountMinor,
        type: "CREDIT",
        description,
      },
    });

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balanceMinor: { increment: amountMinor },
      },
    });

    return { wallet: updated, transaction: tx };
  },

  debit: async ({ accountId, amountMinor, description = "Debit" }) => {
    if (amountMinor <= 0) throw new Error("Amount must be positive");

    const wallet = await prisma.wallet.findFirst({ where: { accountId } });

    if (!wallet) throw new Error("Wallet not found");

    if (wallet.balanceMinor < amountMinor) {
      throw new Error("Insufficient balance");
    }

    const tx = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amountMinor: -amountMinor,
        type: "DEBIT",
        description,
      },
    });

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balanceMinor: { decrement: amountMinor },
      },
    });

    return { wallet: updated, transaction: tx };
  },

  debitIfPossible: async ({ accountId, amountMinor, reference }) => {
    const wallet = await prisma.wallet.findFirst({ where: { accountId } });

    if (!wallet || wallet.balanceMinor < amountMinor) return null;

    const tx = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amountMinor: -amountMinor,
        type: "DEBIT",
        description: "Auto-charge for invoice",
        reference,
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balanceMinor: { decrement: amountMinor },
      },
    });

    return tx;
  },
};

module.exports = walletService;