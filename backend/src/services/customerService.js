const stripe = require("../utils/stripe");
const prisma = require("../prisma/client");

module.exports = { 
    createStripeCustomer: async (user) => {
        const customer = await stripe.customers.create({
            name: user.name,
            email: user.email,
        });

        await prisma.paymentMethod.create({
            data:{
                accountId: user.accountId,
                gateway: "stripe",
                token: customer.id,
                isDefault: true,
            }
        });

        return customer;
    }
}