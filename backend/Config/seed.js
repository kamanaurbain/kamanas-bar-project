const productRepository = require("../Repository/product.repository");
const saleRepository = require("../Repository/sale.repository");
const invoiceRepository = require("../Repository/invoice.repository");
const userRepository = require("../Repository/user.repository");
const counterRepository = require("../Repository/counter.repository");
const hashPassword = require("../utils/hashPassword");
const { generateUserId } = require("../utils/idGenerator");
const defaultData = require("../utils/defaultData");

const ADMIN_EMAIL = "kamanaurbain12@gmail.com";
const ADMIN_PASSWORD = "@Kamana123";

const reverseClone = (items) => {
  return [...items].reverse().map((item) => ({ ...item }));
};

const seedCollectionIfEmpty = async (repository, items, mapItem = (item) => item) => {
  const total = await repository.count();

  if (total > 0) {
    return;
  }

  await repository.insertMany(reverseClone(items).map(mapItem));
};

const ensureCounters = async () => {
  const [maxProduct, maxSale, maxInvoice, maxUser] = await Promise.all([
    productRepository.maxVisibleNumber(),
    saleRepository.maxVisibleNumber(),
    invoiceRepository.maxVisibleNumber(),
    userRepository.maxVisibleNumber(),
  ]);

  await Promise.all([
    counterRepository.ensureAtLeast("product", maxProduct),
    counterRepository.ensureAtLeast("sale", maxSale),
    counterRepository.ensureAtLeast("invoice", maxInvoice),
    counterRepository.ensureAtLeast("user", maxUser),
  ]);
};

const ensureAdminUser = async () => {
  const password = await hashPassword(ADMIN_PASSWORD);
  const existingAuthAdmin = await userRepository.findAdminAuthUser();

  if (existingAuthAdmin) {
    await userRepository.updateById(existingAuthAdmin.id, {
      password,
      authRole: "Admin",
      fullRole: "Administrateur",
      status: "Actif",
    });
    return;
  }

  const existingEmailAdmin = await userRepository.findByEmail(ADMIN_EMAIL);

  if (existingEmailAdmin) {
    await userRepository.updateById(existingEmailAdmin.id, {
      authId: 1,
      password,
      authRole: "Admin",
      fullRole: "Administrateur",
      role: existingEmailAdmin.role || "Administrateur",
      status: "Actif",
    });
    return;
  }

  await userRepository.create({
    id: await generateUserId(),
    authId: 1,
    name: "Kamana urbain",
    email: ADMIN_EMAIL,
    phone: "+257 79 12 34 56",
    password,
    role: "Administrateur",
    authRole: "Admin",
    fullRole: "Administrateur",
    status: "Actif",
    dateCreated: "25/05/2025",
  });
};

const seedDatabase = async () => {
  const adminPassword = await hashPassword(ADMIN_PASSWORD);

  await seedCollectionIfEmpty(productRepository, defaultData.products);
  await seedCollectionIfEmpty(saleRepository, defaultData.sales);
  await seedCollectionIfEmpty(invoiceRepository, defaultData.invoices);
  await seedCollectionIfEmpty(userRepository, defaultData.users, (user) => {
    if (user.email !== ADMIN_EMAIL) {
      return user;
    }

    return {
      ...user,
      authId: 1,
      password: adminPassword,
      authRole: "Admin",
      fullRole: "Administrateur",
    };
  });

  await ensureCounters();
  await ensureAdminUser();
};

module.exports = seedDatabase;
