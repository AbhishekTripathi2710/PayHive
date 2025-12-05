const prisma = require("../prisma/client");
const stripe = require("../utils/stripe");

module.exports = {
    createSetupIntent: async (customerId) => {
        return stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ["card"],
        });
    },

    savePaymentMethod: async (userFromJWT, paymentMethodId) => {
        const user = await prisma.user.findUnique({
            where: { id: userFromJWT.userId }
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.stripeCustomerId) {
            throw new Error("User does not have a Stripe customer ID. Please create a customer first.");
        }
        
        const attached = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: user.stripeCustomerId,
        });

        
        await stripe.customers.update(user.stripeCustomerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        const card = attached.card;

        
        return prisma.paymentMethod.create({
            data: {
                accountId: userFromJWT.accountId,
                gateway: "stripe",
                token: paymentMethodId,               
                brand: card.brand,
                last4: card.last4,
                expMonth: card.exp_month,
                expYear: card.exp_year,
                isDefault: true,
            },
        });
    },
};
