const prisma = require("../prisma/client");

module.exports = {
  handleEvent: async (event) => {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const sub = await prisma.subscription.findFirst({ where: { stripeId: invoice.subscription }});
        if (sub) {
          await prisma.invoice.upsert({
            where: { gatewayInvoiceId: invoice.id },
            update: {
              status: invoice.status,
              amountPaidMinor: invoice.amount_paid,
              amountDueMinor: invoice.amount_due
            },
            create: {
              accountId: sub.accountId,
              subscriptionId: sub.id,
              invoiceNumber: invoice.number ?? invoice.id,
              periodStart: new Date(invoice.period_start * 1000),
              periodEnd: new Date(invoice.period_end * 1000),
              currency: invoice.currency?.toUpperCase(),
              status: invoice.status,
              amountDueMinor: invoice.amount_due,
              amountPaidMinor: invoice.amount_paid,
              gatewayInvoiceId: invoice.id
            }
          });

          if (invoice.charge) {
            await prisma.payment.create({
              data: {
                accountId: sub.accountId,
                invoiceId: sub.id, 
                paymentMethodId: null,
                gateway: "stripe",
                gatewayPaymentId: invoice.charge,
                amountMinor: invoice.amount_paid,
                status: "succeeded",
                attemptNumber: 1,
              }
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const sub = await prisma.subscription.findFirst({ where: { stripeId: invoice.subscription }});
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "past_due" }
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const s = event.data.object;
        const sub = await prisma.subscription.findFirst({ where: { stripeId: s.id }});
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
          const pm = await prisma.paymentMethod.findFirst({ where: { token: s.customer, gateway: "stripe" }});
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
