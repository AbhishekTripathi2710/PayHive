import API from "./axios";

export const getPlans = () => API.get("/plans");
export const createPlan = (data) => API.post("/plans",data);
export const updatePlan = (id,data) => API.put(`/plans/${id}`,data);
export const deletePlan = (id) => API.delete(`/plans/${id}`);