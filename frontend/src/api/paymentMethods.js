import API from "./axios";

export const getPaymentMethods = () => API.get("/payment-methods");

export const createStripeCustomer = () =>
  API.post("/customer/create-stripe-customer");

export const createSetupIntent = () =>
  API.post("/payment/create-setup-intent");

export const saveCard = (paymentMethodId) =>
  API.post("/payment/save-card", { paymentMethodId });
