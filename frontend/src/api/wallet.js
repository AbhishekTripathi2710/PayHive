import API from "./axios";

export const getWallet = () => API.get("/wallet/me");

export const creditWallet = (amountMinor, description) =>
  API.post("/wallet/credit", { amountMinor, description });

export const debitWallet = (amountMinor, description) =>
  API.post("/wallet/debit", { amountMinor, description });

