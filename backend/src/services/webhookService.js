const prisma = require("../prisma/client");
const walletService = require("../services/walletService")

module.exports = {
    handleEvent: async (event) => {
        switch (event.type) {
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;

                const sub = await prisma.subscription.findFirst({
                    where: { stripeId: invoice.subscription }
                });

                if (!sub) {
                    console.log(" Subscription not found for invoice:", invoice.id);
                    return;
                }

                const dbInvoice = await prisma.invoice.upsert({
                    where: { gatewayInvoiceId: invoice.id },
                    update: {
                        status: invoice.status,
                        amountPaidMinor: invoice.amount_paid,
                        amountDueMinor: invoice.amount_due,
                        periodStart: new Date(invoice.period_start * 1000),
                        periodEnd: new Date(invoice.period_end * 1000)
                    },
                    create: {
                        accountId: sub.accountId,
                        subscriptionId: sub.id,
                        invoiceNumber: invoice.number ?? invoice.id,
                        gatewayInvoiceId: invoice.id,
                        periodStart: new Date(invoice.period_start * 1000),
                        periodEnd: new Date(invoice.period_end * 1000),
                        currency: invoice.currency.toUpperCase(),
                        status: invoice.status,
                        amountDueMinor: invoice.amount_due,
                        amountPaidMinor: invoice.amount_paid
                    }
                });

                if (invoice.charge) {
                    await prisma.payment.create({
                        data: {
                            accountId: sub.accountId,
                            invoiceId: dbInvoice.id,
                            gateway: "stripe",
                            gatewayPaymentId: invoice.charge,
                            amountMinor: invoice.amount_paid,
                            status: "succeeded",
                            attemptNumber: 1
                        }
                    });
                }

                break;
            }


            case "invoice.payment_failed": {
                const invoice = event.data.object;

                const sub = await prisma.subscription.findFirst({
                    where: { stripeId: invoice.subscription }
                });

                if (!sub) {
                    console.log(" Subscription not found for failed invoice:", invoice.id);
                    return;
                }

                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: { status: "past_due" }
                });

                let dbInvoice = await prisma.invoice.findUnique({
                    where: { gatewayInvoiceId: invoice.id }
                });

                if (!dbInvoice) {
                    console.log(" Invoice missing in DB, creating fallback invoice...");

                    dbInvoice = await prisma.invoice.create({
                        data: {
                            accountId: sub.accountId,
                            subscriptionId: sub.id,
                            invoiceNumber: invoice.number ?? invoice.id,
                            gatewayInvoiceId: invoice.id,
                            periodStart: new Date(invoice.period_start * 1000),
                            periodEnd: new Date(invoice.period_end * 1000),
                            currency: invoice.currency.toUpperCase(),
                            status: invoice.status,
                            amountDueMinor: invoice.amount_due,
                            amountPaidMinor: 0
                        }
                    });
                }

                console.log(` Attempting wallet auto-payment for invoice ${invoice.id}`);

                const walletTx = await walletService.debitIfPossible({
                    accountId: sub.accountId,
                    amountMinor: invoice.amount_due,
                    reference: invoice.id
                });

                if (walletTx) {
                    console.log("Wallet auto-payment succeeded!");

                    await prisma.invoice.update({
                        where: { id: dbInvoice.id },
                        data: {
                            status: "paid",
                            amountPaidMinor: invoice.amount_due
                        }
                    });

                    await prisma.payment.create({
                        data: {
                            accountId: sub.accountId,
                            invoiceId: dbInvoice.id,
                            gateway: "wallet",                           
                            gatewayPaymentId: walletTx.id.toString(), 
                            amountMinor: invoice.amount_due,
                            status: "succeeded",
                            attemptNumber: 1
                        }
                    });

                    return; 
                }

                console.log("⚠️ Wallet insufficient → Stripe will retry using normal schedule");

                break;
            }


            case "customer.subscription.updated":
            case "customer.subscription.created": {
                const s = event.data.object;
                const sub = await prisma.subscription.findFirst({ where: { stripeId: s.id } });
                if (sub) {
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: {
                            status: s.status,
                            currentPeriodStart: s.current_period_start ? new Date(s.current_period_start * 1000) : null,
                            currentPeriodEnd: s.current_period_end ? new Date(s.current_period_end * 1000) : null
                        }
                    });
                } else {
                    const pm = await prisma.paymentMethod.findFirst({ where: { token: s.customer, gateway: "stripe" } });
                    if (pm) {
                        await prisma.subscription.create({
                            data: {
                                accountId: pm.accountId,
                                userId: pm.accountId,
                                planId: null,
                                stripeId: s.id,
                                status: s.status,
                                startDate: s.start_date ? new Date(s.start_date * 1000) : new Date(),
                                currentPeriodStart: s.current_period_start ? new Date(s.current_period_start * 1000) : null,
                                currentPeriodEnd: s.current_period_end ? new Date(s.current_period_end * 1000) : null,
                            }
                        });
                    }
                }
                break;
            }

            case "payment_method.attached":
                break;

            default:
                break;
        }
    }
};
