import API from "./axios";

export const getSubscriptions = () => API.get("/dashboard/subscriptions");

export const getOneSubscription = (id) =>
  API.get(`/dashboard/subscriptions/${id}`);

export const pauseSubscription = (id) =>
  API.post(`/subscription/${id}/pause`);

export const resumeSubscription = (id) =>
  API.post(`/subscription/${id}/resume`);