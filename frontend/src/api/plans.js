import API from "./axios";

export const getPlans = () => API.get("/plans")