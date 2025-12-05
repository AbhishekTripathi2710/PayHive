const stripe = require("../utils/stripe");
const prisma = require("../prisma/client");

module.exports = {
    createStripeCustomer: async (user) => {
        const customer = await stripe.customers.create({
            name: user.name,
            email: user.email,
        });

        await prisma.user.update({
            where: { id: user.userId },
            data: { stripeCustomerId: customer.id },
        });

        return customer;
    }
}