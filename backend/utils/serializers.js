const serializeProduct = (product) => {
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    unit: product.unit,
    status: product.status,
    dateAdded: product.dateAdded,
    description: product.description,
    minStock: product.minStock,
    reference: product.reference,
  };
};

const serializeSale = (sale) => {
  if (!sale) {
    return null;
  }

  const serialized = {
    id: sale.id,
    client: sale.client,
    cashier: sale.cashier,
    total: sale.total,
    date: sale.date,
    status: sale.status,
  };

  if (sale.products !== undefined) {
    serialized.products = sale.products || [];
  }

  if (sale.receivedAmount !== undefined) {
    serialized.receivedAmount = sale.receivedAmount;
  }

  if (sale.change !== undefined) {
    serialized.change = sale.change;
  }

  return serialized;
};

const serializeInvoice = (invoice) => {
  if (!invoice) {
    return null;
  }

  return {
    id: invoice.id,
    saleId: invoice.saleId,
    client: invoice.client,
    cashier: invoice.cashier,
    total: invoice.total,
    date: invoice.date,
    status: invoice.status,
  };
};

const serializeInvoiceDetails = (invoice, products) => {
  return {
    ...serializeInvoice(invoice),
    products,
  };
};

const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  const serialized = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    dateCreated: user.dateCreated,
  };

  if (user.permissions !== undefined) {
    serialized.photo = user.photo || "";
    serialized.permissions = user.permissions;
  }

  return serialized;
};

const serializeAuthUser = (user) => {
  if (!user) {
    return null;
  }

  const fullRole = user.fullRole || user.role || "Administrateur";

  return {
    id: user.authId || user.id,
    name: user.name,
    email: user.email,
    role: user.authRole || (fullRole === "Administrateur" ? "Admin" : fullRole),
    fullRole,
  };
};

module.exports = {
  serializeProduct,
  serializeSale,
  serializeInvoice,
  serializeInvoiceDetails,
  serializeUser,
  serializeAuthUser,
};
