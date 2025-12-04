import API from "./axios";

export const getSubscriptionDetail = (id) =>
  API.get(`/subscription/${id}`);

export const getUsageEvents = (id) =>
  API.get(`/subscription/${id}/usage`);

export const pauseSubscription = (id) =>
  API.post(`/subscription/${id}/pause`);

export const resumeSubscription = (id) =>
  API.post(`/subscription/${id}/resume`);

export const cancelSubscription = (id) =>
  API.post(`/subscription/${id}/cancel`);

export const changePlan = (id, planId) =>
  API.post(`/subscription/${id}/change-plan`, { planId });

export const addUsageEvent = (id, metric, quantity) =>
  API.post(`/subscription/${id}/usage`, {metric, quantity});