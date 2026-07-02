import api from "./api";

export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data;
};

export const getSale = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};

export const createSale = async (data) => {
  const response = await api.post("/sales", data);
  return response.data;
};

export const updateSale = async (id, data) => {
  const response = await api.put(`/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};

export const getSalesHistory = async () => {
  const response = await api.get("/sales/history");
  return response.data;
};
