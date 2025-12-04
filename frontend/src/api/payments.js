import API from "./axios";

export const getPayments = () => API.get("/dashboard/payments");
