const cleanNumber = (value) => {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatAmount = (value) => {
  const number = typeof value === "number" ? value : cleanNumber(value);
  const rounded = Math.max(Math.trunc(number), 0);

  return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatCurrency = (value) => {
  return `${formatAmount(value)} FBu`;
};

const pad = (value) => {
  return String(value).padStart(2, "0");
};

const formatDate = (date = new Date()) => {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const formatDateTime = (date = new Date()) => {
  return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const normalizeString = (value) => {
  return String(value ?? "").trim();
};

module.exports = {
  cleanNumber,
  formatAmount,
  formatCurrency,
  formatDate,
  formatDateTime,
  normalizeString,
};
