import { faker } from "@faker-js/faker";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Seeding Quipurati iniziato...");

  // Pulizia rispettando l'ordine della Foreign Key (prima N, poi 1)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Opzione A (stile di classe con Faker.js): 5 nomi di categoria unici
  // const categoryNames = faker.helpers.uniqueArray(faker.commerce.department, 5);

  // Categorie realistiche per il catalogo Quipurati
  const categoryNames = [
    "Orologi Automatici",
    "Cronografi",
    "Orologi Diver",
    "Orologi Classici",
    "Accessori & Gioielli",
  ];

  // Trasformiamo l'array de strings in array di oggietti { name } per Prisma
  const categoriesData = categoryNames.map((name) => ({ name }));

  // Inserimento di massa nella tabella Category
  await prisma.category.createMany({
    data: categoriesData,
  });

  // Recuperiamo le categorie create con i loro ID reali generati da MySQL
  const categories = await prisma.category.findMany();
  // console.log("Categorie create:", categories);

  // Marchi del catalogo Quipurati per combinare dati reali con Faker
  const brands = ["Curren", "Lige", "Pagani Design", "Naviforce", "Steeldive"];
  const products = [];

  // Generiamo 15 prodotti fittizi associati a una categoria casuale valida
  for (let i = 0; i < 15; i++) {
    products.push({
      name: faker.commerce.productName(),
      brand: faker.helpers.arrayElement(brands),
      description: faker.lorem.paragraph({ min:2, max:4}),
      price: Number(faker.commerce.price({ min:29, max: 250, dec: 2 })),
      stock: faker.number.int({ min:0, max: 50 }),
      isActive: faker.datatype.boolean(),
      categoryId: faker.helpers.arrayElement(categories).id,    
    });   
  }

  // Inserimento di massa nella tabella Product
  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seeding completato: ${categories.length} categorie e ${products.length} prodotti`);
}

main()
  .catch((err) => {
    console.error("Errore durante il seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
