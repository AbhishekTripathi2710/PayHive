import API from "./axios";

export const getSubscriptions = () => API.get("/dashboard/subscriptions");

export const getOneSubscription = (id) =>
  API.get(`/dashboard/subscriptions/${id}`);

export const pauseSubscription = (id) =>
  API.post(`/subscription/${id}/pause`);

export const resumeSubscription = (id) =>
  API.post(`/subscription/${id}/resume`);

export const createSubscription = (data) => 
  API.post("/subscription",data);

export const getPlans = () => 
  API.get("/plans");

export const getPaymentMethods = () => 
  API.get("/payment/payment-methods");