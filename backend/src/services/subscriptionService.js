const stripe = require("../utils/stripe");
const prisma = require("../prisma/client");

async function ensureStripePrice(plan) {
  if (plan.stripePriceId) return plan.stripePriceId;

  const product = await stripe.products.create({
    name: plan.name,
    metadata: { planId: String(plan.id) },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.priceMinor,
    currency: plan.currency.toLowerCase(),
    recurring: { interval: plan.billingCycle.toLowerCase() === "monthly" ? "month" : "year" },
  });

  await prisma.plan.update({
    where: { id: plan.id },
    data: { stripePriceId: price.id, stripeProductId: product.id }
  });

  return price.id;
}

module.exports = {
  createSubscription: async ({ user, planId, paymentMethodId }) => {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plan not found");

    const pm = await prisma.paymentMethod.findFirst({
      where: { accountId: user.accountId, gateway: "stripe" }
    });
    if (!pm) throw new Error("Stripe customer not found for this account. Create Stripe customer first.");

    const stripeCustomerId = pm.token;

    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    const priceId = await ensureStripePrice(plan);

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId, quantity: plan.isMetered ? 1 : 1 }],
      default_payment_method: paymentMethodId,
      expand: ["latest_invoice.payment_intent"]
    });

    const created = await prisma.subscription.create({
      data: {
        accountId: user.accountId,
        userId: user.userId,
        planId: plan.id,
        status: subscription.status,
        startDate: new Date(subscription.start_date * 1000),
        currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null,
        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        stripeId: subscription.id,
      },
    });

    if (subscription.latest_invoice) {
      const inv = subscription.latest_invoice;
      await prisma.invoice.create({
        data: {
          accountId: user.accountId,
          subscriptionId: created.id,
          invoiceNumber: String(inv.number ?? inv.id),
          periodStart: new Date(inv.period_start * 1000),
          periodEnd: new Date(inv.period_end * 1000),
          currency: inv.currency?.toUpperCase() || plan.currency,
          status: inv.status || "pending",
          amountDueMinor: inv.amount_due ?? 0,
          amountPaidMinor: inv.amount_paid ?? 0,
          gatewayInvoiceId: inv.id
        }
      });

      if (inv.payment_intent && inv.payment_intent.status === "succeeded") {
        await prisma.payment.create({
          data: {
            accountId: user.accountId,
            invoiceId: created.id,
            paymentMethodId: null,
            gateway: "stripe",
            gatewayPaymentId: inv.payment_intent.id,
            amountMinor: inv.amount_paid ?? 0,
            status: "succeeded",
            attemptNumber: 1,
          }
        });
      }
    }

    return { subscription, dbSubscription: created };
  },

  cancelSubscription: async ({ subscriptionId, immediate, user }) => {
    const sub = await prisma.subscription.findUnique({
      where: { id: Number(subscriptionId) },
    });
    if (!sub) throw new Error("Subscription not found");

    const stripeSub = await stripe.subscriptions.update(sub.stripeId, {
      cancel_at_period_end: !immediate,
    });

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: immediate ? "canceled" : "cancel_at_period_end",
        cancelAtPeriodEnd: !immediate,
      },
    });

    return { message: "Subscription canceled", stripe: stripeSub };
  },

  changePlan: async ({ subscriptionId, newPlanId, user }) => {
    const sub = await prisma.subscription.findUnique({
      where: { id: Number(subscriptionId) },
    });
    if (!sub) throw new Error("Subscription not found");

    const newPlan = await prisma.plan.findUnique({
      where: { id: Number(newPlanId) },
    });
    if (!newPlan) throw new Error("New plan not found");

    const newPriceId = await ensureStripePrice(newPlan);

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeId);

    const itemId = stripeSub.items.data[0].id;

    const updated = await stripe.subscriptions.update(sub.stripeId, {
      items: [
        {
          id: itemId,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        planId: newPlan.id,
        currentPeriodStart: new Date(updated.current_period_start * 1000),
        currentPeriodEnd: new Date(updated.current_period_end * 1000),
        status: updated.status,
      },
    });

    return { message: "Plan updated", stripe: updated };
  },

  pauseSubscription: async ({subscriptionId, user}) => {
    const sub = await prisma.subscription.findUnique({
      where: {id : Number(subscriptionId)},
    });
    if(!sub) throw new Error("Subscription not found");
    if(sub.accountId !== user.accountId) throw new Error("Forbidden");

    const stripeSub = await stripe.subscriptions.update(sub.stripeId, {
      pause_collection: {
        behavior: "mark_uncollectible",
      },
    });

    const updated = await prisma.subscription.update({
      where: {id: sub.id},
      data: {status: "paused"},
    });

    return {message: "Subscription paused", stripe: stripeSub, db: updated};
  },

  resumeSubscription: async ({subscriptionId, user})=> {
    const sub = await prisma.subscription.findUnique({
      where: {id: Number(subscriptionId)}
    });
    if(!sub) throw new Error("Subscription not found");
    if(sub.accountId !== user.accountId) throw new Error("Forbidden");

    const stripeSub = await stripe.subscriptions.update(sub.stripeId, {
      pause_collection: "",
    });

    const updated = await prisma.subscription.update({
      where: {id: sub.id},
      data: {status: stripeSub.status || "active"},
    });

    return {message: "Subscription resumed", stripe: stripeSub, db: updated};
  },

  recordUsage: async ({subscriptionId, metric, quantity, user}) => {
    const sub = await prisma.subscription.findUnique({
      where: {id: subscriptionId},
      include: {plan: true},
    });

    if(!sub) throw new Error("Subscription not found");

    if(sub.accountId !== user.accountId) throw new Error("Forbidden");

    if(!sub.plan.isMetered) throw new Error("Plan is not meterd");

    if(!sub.stripeId) throw new Error("Subscription is not linked to stripe");

    const stripeSub = await stripe.subscriptions.retrieve(prisma.subscription.stripeId);

    if(!stripeSub.items || !stripeSub.items.data.lenght) throw new Error("No subscription items found on Stripe subcription");

    const subscriptionItemId = stripeSub.items.data[0].id;

    const timestamp = Math.floor(Date.now() / 1000);

    const stripeUsageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        action: "increment",
        timestamp,
      }
    );

    const usageEvent = await prisma.usageEvent.create({
      data: {
        subscriptionId,
        metric,
        quantity,
        eventTimestamp: new Date(),
      },
    });

    return{
      stripeUsageRecord,
      usageEvent,
    };
  },

  getUsageEvents: async ({subscriptionId, user}) => {
    const subscription = await prisma.subscription.findUnique({
      where : {id: subscriptionId},
    });

    if(!subscription) throw new Error("Subscription not found");

    if(subscription.accountId !== user.accountId) throw new Error("Forbidden");

    const events = await prisma.usageEvent.findMany({
      where: {subscriptionId},
      orderBy: {eventTimestamp: "desc"},
    });

    return events;
  }
};
