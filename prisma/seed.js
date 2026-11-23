import { faker } from "@faker-js/faker";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Seeding Quipurati iniziato...");

  // Pulizia rispettando l'ordine della Foreign Key (prima N, poi 1)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Opzione A (stile di classe con Faker.js): 5 nomi di categoria unici
  const categoryNames = faker.helpers.uniqueArray(faker.commerce.department, 5);

  //Opzione B (alternativa realistica per Quipurati senza Faker)
  // const categoryNames = [
  //   "Orologi Automatici",
  //   "Cronografi",
  //   "Orologi Diver",
  //   "Orologi Classici",
  //   "Accessori & Gioielli",
  // ];

  // Trasformiamo l'array de strings in array di oggietti { name } per Prisma
  const categoriesData = categoryNames.map((name) => ({ name }));

  
  
}
