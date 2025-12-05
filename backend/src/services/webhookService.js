const prisma = require("../prisma/client");
const walletService = require("../services/walletService");

module.exports = {
    handleEvent: async (event) => {
        try {
            switch (event.type) {
                case "invoice.payment_succeeded": {
                    const invoice = event.data.object;

                    const sub = await prisma.subscription.findFirst({
                        where: { stripeId: invoice.subscription }
                    });

                    if (!sub) {
                        console.log(`⚠️ Subscription not found for invoice: ${invoice.id}`);
                        return;
                    }

                    const dbInvoice = await prisma.invoice.upsert({
                        where: { gatewayInvoiceId: invoice.id },
                        update: {
                            status: invoice.status || "paid",
                            amountPaidMinor: invoice.amount_paid || invoice.amount_due || 0,
                            amountDueMinor: invoice.amount_due || 0,
                            periodStart: new Date(invoice.period_start * 1000),
                            periodEnd: new Date(invoice.period_end * 1000)
                        },
                        create: {
                            accountId: sub.accountId,
                            subscriptionId: sub.id,
                            invoiceNumber: invoice.number || `INV-${Date.now()}`,
                            gatewayInvoiceId: invoice.id,
                            periodStart: new Date(invoice.period_start * 1000),
                            periodEnd: new Date(invoice.period_end * 1000),
                            currency: (invoice.currency || "INR").toUpperCase(),
                            status: invoice.status || "paid",
                            amountDueMinor: invoice.amount_due || 0,
                            amountPaidMinor: invoice.amount_paid || invoice.amount_due || 0
                        }
                    });

                    if (sub.status === "past_due") {
                        await prisma.subscription.update({
                            where: { id: sub.id },
                            data: { status: "active" }
                        });
                    }

                    if (invoice.charge) {
                        const existingPayment = await prisma.payment.findFirst({
                            where: { gatewayPaymentId: invoice.charge }
                        });

                        if (!existingPayment) {
                            await prisma.payment.create({
                                data: {
                                    accountId: sub.accountId,
                                    invoiceId: dbInvoice.id,
                                    gateway: "stripe",
                                    gatewayPaymentId: invoice.charge,
                                    amountMinor: invoice.amount_paid || invoice.amount_due || 0,
                                    status: "succeeded",
                                    attemptNumber: 1
                                }
                            });
                        }
                    }

                    if (invoice.payment_intent) {
                        const paymentIntentId = typeof invoice.payment_intent === 'string' 
                            ? invoice.payment_intent 
                            : invoice.payment_intent.id;

                        const existingPayment = await prisma.payment.findFirst({
                            where: { gatewayPaymentId: paymentIntentId }
                        });

                        if (!existingPayment) {
                            await prisma.payment.create({
                                data: {
                                    accountId: sub.accountId,
                                    invoiceId: dbInvoice.id,
                                    gateway: "stripe",
                                    gatewayPaymentId: paymentIntentId,
                                    amountMinor: invoice.amount_paid || invoice.amount_due || 0,
                                    status: "succeeded",
                                    attemptNumber: 1
                                }
                            });
                        }
                    }

                    console.log(` Invoice payment succeeded: ${invoice.id} for subscription ${sub.id}`);
                    break;
                }


                case "invoice.payment_failed": {
                    const invoice = event.data.object;

                    const sub = await prisma.subscription.findFirst({
                        where: { stripeId: invoice.subscription }
                    });

                    if (!sub) {
                        console.log(` Subscription not found for failed invoice: ${invoice.id}`);
                        return;
                    }

                    // Update subscription to past_due
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: "past_due" }
                    });

                    // Upsert invoice
                    let dbInvoice = await prisma.invoice.findUnique({
                        where: { gatewayInvoiceId: invoice.id }
                    });

                    if (!dbInvoice) {
                        console.log(`Creating invoice record for failed payment: ${invoice.id}`);

                        dbInvoice = await prisma.invoice.create({
                            data: {
                                accountId: sub.accountId,
                                subscriptionId: sub.id,
                                invoiceNumber: invoice.number || `INV-${Date.now()}`,
                                gatewayInvoiceId: invoice.id,
                                periodStart: new Date(invoice.period_start * 1000),
                                periodEnd: new Date(invoice.period_end * 1000),
                                currency: (invoice.currency || "INR").toUpperCase(),
                                status: invoice.status || "open",
                                amountDueMinor: invoice.amount_due || 0,
                                amountPaidMinor: 0
                            }
                        });
                    } else {
                        await prisma.invoice.update({
                            where: { id: dbInvoice.id },
                            data: {
                                status: invoice.status || "open",
                                amountDueMinor: invoice.amount_due || 0
                            }
                        });
                    }

                    if (invoice.attempt_count) {
                        await prisma.payment.create({
                            data: {
                                accountId: sub.accountId,
                                invoiceId: dbInvoice.id,
                                gateway: "stripe",
                                gatewayPaymentId: invoice.payment_intent || `failed-${invoice.id}-${invoice.attempt_count}`,
                                amountMinor: invoice.amount_due || 0,
                                status: "failed",
                                attemptNumber: invoice.attempt_count || 1
                            }
                        });
                    }

                    console.log(` Attempting wallet auto-payment for invoice ${invoice.id}`);

                    const walletTx = await walletService.debitIfPossible({
                        accountId: sub.accountId,
                        amountMinor: invoice.amount_due || 0,
                        reference: invoice.id
                    });

                    if (walletTx) {
                        console.log(` Wallet auto-payment succeeded for invoice ${invoice.id}`);

                        await prisma.invoice.update({
                            where: { id: dbInvoice.id },
                            data: {
                                status: "paid",
                                amountPaidMinor: invoice.amount_due || 0
                            }
                        });

                        await prisma.subscription.update({
                            where: { id: sub.id },
                            data: { status: "active" }
                        });

                        await prisma.payment.create({
                            data: {
                                accountId: sub.accountId,
                                invoiceId: dbInvoice.id,
                                gateway: "wallet",
                                gatewayPaymentId: `wallet-${walletTx.id}`,
                                amountMinor: invoice.amount_due || 0,
                                status: "succeeded",
                                attemptNumber: (invoice.attempt_count || 0) + 1
                            }
                        });

                        return;
                    }

                    console.log(`Wallet insufficient for invoice ${invoice.id}. Stripe will retry.`);
                    break;
                }


                case "customer.subscription.updated":
                case "customer.subscription.created": {
                    const s = event.data.object;
                    
                    let sub = await prisma.subscription.findFirst({ 
                        where: { stripeId: s.id } 
                    });

                    if (sub) {
                        await prisma.subscription.update({
                            where: { id: sub.id },
                            data: {
                                status: s.status || sub.status,
                                currentPeriodStart: s.current_period_start 
                                    ? new Date(s.current_period_start * 1000) 
                                    : sub.currentPeriodStart,
                                currentPeriodEnd: s.current_period_end 
                                    ? new Date(s.current_period_end * 1000) 
                                    : sub.currentPeriodEnd,
                                cancelAtPeriodEnd: s.cancel_at_period_end || false,
                                trialEnd: s.trial_end ? new Date(s.trial_end * 1000) : null,
                                quantity: s.items?.data?.[0]?.quantity || s.quantity || 1
                            }
                        });

                        console.log(`Subscription updated: ${s.id} → status: ${s.status}`);
                    } else {
                        const user = await prisma.user.findFirst({ 
                            where: { stripeCustomerId: s.customer } 
                        });

                        if (user) {
                            const plan = await prisma.plan.findFirst({
                                where: { 
                                    accountId: user.accountId,
                                    active: true
                                }
                            });

                            sub = await prisma.subscription.create({
                                data: {
                                    accountId: user.accountId,
                                    userId: user.id,
                                    planId: plan?.id || 1,
                                    stripeId: s.id,
                                    status: s.status || "active",
                                    startDate: s.start_date ? new Date(s.start_date * 1000) : new Date(),
                                    currentPeriodStart: s.current_period_start 
                                        ? new Date(s.current_period_start * 1000) 
                                        : null,
                                    currentPeriodEnd: s.current_period_end 
                                        ? new Date(s.current_period_end * 1000) 
                                        : null,
                                    cancelAtPeriodEnd: s.cancel_at_period_end || false,
                                    trialEnd: s.trial_end ? new Date(s.trial_end * 1000) : null,
                                    quantity: s.items?.data?.[0]?.quantity || s.quantity || 1
                                }
                            });

                            console.log(`Subscription created from webhook: ${s.id}`);
                        } else {
                            console.log(`User not found for subscription customer: ${s.customer}`);
                        }
                    }
                    break;
                }

                case "payment_intent.succeeded": {
                    const paymentIntent = event.data.object;

                    let invoice = null;
                    if (paymentIntent.invoice) {
                        invoice = typeof paymentIntent.invoice === 'string' 
                            ? { id: paymentIntent.invoice } 
                            : paymentIntent.invoice;
                    }

                    if (!invoice) {
                        console.log(`No invoice found for payment intent: ${paymentIntent.id}`);
                        break;
                    }

                    const stripe = require("../utils/stripe");
                    let stripeInvoice;
                    try {
                        stripeInvoice = await stripe.invoices.retrieve(invoice.id);
                    } catch (err) {
                        console.log(`Could not retrieve Stripe invoice: ${invoice.id}`);
                        break;
                    }

                    const sub = await prisma.subscription.findFirst({
                        where: { stripeId: stripeInvoice.subscription }
                    });

                    if (!sub) {
                        console.log(`Subscription not found for payment intent: ${paymentIntent.id}`);
                        break;
                    }

                    const dbInvoice = await prisma.invoice.upsert({
                        where: { gatewayInvoiceId: stripeInvoice.id },
                        update: {
                            status: stripeInvoice.status || "paid",
                            amountPaidMinor: stripeInvoice.amount_paid || paymentIntent.amount || 0,
                            amountDueMinor: stripeInvoice.amount_due || 0
                        },
                        create: {
                            accountId: sub.accountId,
                            subscriptionId: sub.id,
                            invoiceNumber: stripeInvoice.number || `INV-${Date.now()}`,
                            gatewayInvoiceId: stripeInvoice.id,
                            periodStart: new Date(stripeInvoice.period_start * 1000),
                            periodEnd: new Date(stripeInvoice.period_end * 1000),
                            currency: (stripeInvoice.currency || "INR").toUpperCase(),
                            status: stripeInvoice.status || "paid",
                            amountDueMinor: stripeInvoice.amount_due || 0,
                            amountPaidMinor: stripeInvoice.amount_paid || paymentIntent.amount || 0
                        }
                    });

                    const existingPayment = await prisma.payment.findFirst({
                        where: { gatewayPaymentId: paymentIntent.id }
                    });

                    if (!existingPayment) {
                        await prisma.payment.create({
                            data: {
                                accountId: sub.accountId,
                                invoiceId: dbInvoice.id,
                                gateway: "stripe",
                                gatewayPaymentId: paymentIntent.id,
                                amountMinor: paymentIntent.amount || stripeInvoice.amount_paid || 0,
                                status: "succeeded",
                                attemptNumber: 1
                            }
                        });
                    }

                    if (sub.status === "past_due") {
                        await prisma.subscription.update({
                            where: { id: sub.id },
                            data: { status: "active" }
                        });
                    }

                    console.log(`Payment intent succeeded: ${paymentIntent.id} for invoice ${stripeInvoice.id}`);
                    break;
                }

                case "payment_method.attached":
                    console.log(`Payment method attached: ${event.data.object.id}`);
                    break;

                case "customer.subscription.deleted": {
                    const s = event.data.object;
                    const sub = await prisma.subscription.findFirst({
                        where: { stripeId: s.id }
                    });

                    if (sub) {
                        await prisma.subscription.update({
                            where: { id: sub.id },
                            data: {
                                status: "canceled",
                                cancelAtPeriodEnd: false
                            }
                        });
                        console.log(`Subscription canceled: ${s.id}`);
                    }
                    break;
                }

                default:
                    console.log(`Unhandled webhook event type: ${event.type}`);
                    break;
            }
        } catch (error) {
            console.error(`Error processing webhook ${event.type}:`, error);
            throw error;
        }
    }
};
