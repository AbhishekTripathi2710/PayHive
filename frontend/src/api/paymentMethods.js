import API from "./axios";

export const getPaymentMethods = () => API.get("/payment/payment-methods");

export const createStripeCustomer = (stripeCustomerId) =>
  API.post("/customer/create-stripe-customer",{stripeCustomerId});

export const createSetupIntent = () =>
  API.post("/payment/create-setup-intent");

export const saveCard = (paymentMethodId) =>
  API.post("/payment/save-card", { paymentMethodId });
