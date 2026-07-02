import api from "./api";

export const getInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const getInvoice = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (data) => {
  const response = await api.post("/invoices", data);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};
