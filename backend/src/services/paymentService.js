const prisma = require("../prisma/client");
const stripe = require("../utils/stripe");

module.exports = {
    createSetupIntent: async (customerId) => {
        return await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ["card"],
        })
    },

    savePaymentMethod: async (user, paymentMethodId) => {
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: user.stripeCustomerId,
        });

        await stripe.customers.update(user.stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return await prisma.paymentMethod.create({
            data:{
                accountId:user.accountId,
                gateway: "stripe",
                token: paymentMethodId,
                isDefault: true,
            }
        })
    }
}