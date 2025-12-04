import API from "./axios";

export const getInvoices = () => API.get("/dashboard/invoices");

export const getInvoiceDetail = (invoiceId) =>
  API.get(`/dashboard/invoices/${invoiceId}`);
