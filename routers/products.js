import express from "express";
import prisma from "../lib/prisma.js";
import { index, show, store } from "../controllers/productController.js";

const router = express.Router();

// Utilities locali per centralizzare errori JSON e validazioni di base
const sendError = (res, status, message) =>
  res.status(status).json({ error: message, status });
// Verifica che il valore sia una stringa non vuota (rimuovendo spazi bianchi)
const isStringValid = (value) =>
  typeof value === "string" && value.trim() !== "";

// Prefisso definito in app.js "/api/products"

// INDEX - Lista dei prodotti attivi con limite opzionale (GET /api/products?limit=3)
router.get("/", index);

// SHOW - Dettagli completi di un singolo prodotto con categoria inclusa (GET /api/products/:id)
router.get("/:id", show);

// STORE - Creazione di un nuovo prodotto (POST /products)
router.post("/", store);

// UPDATE - Modificazione parziale o totale di un prodotto (PATCH /products/:id)
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Validazione di formato ID riceuto nella URL
  if (!Number.isInteger(id)) {
    return sendError(res, 400, "Invalid product ID");
  }  

  // Verificare l'esistenza del prodotto prima di tentare un aggiornamento
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });
  // Controllo l'esistenza della risorsa e restituisco errore se non trovo nulla
  if (!existingProduct) {
    return sendError(res, 404, "Product not found");
  }

  // In PATCH tutti i campi sono facoltativi; se non arrivano rimangono in undefined
  const { name, brand, description, price, stock, isActive, categoryId } = req.body || {};
  // Validazione Stringhe
  if (name !== undefined && !isStringValid(name)) {
    return sendError(res, 400, "Invalid product brand")
  }
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return sendError(res, 400, "Invalid product description")
  }
  // Validazione Numeri (stock e price)
  let parsedPrice;
  if (price !== undefined) {
    parsedStock = Number(stock);
    if (stock === "" || !Number.isInteger(parsedStock) || parsedStock < 0) {
      return sendError(res, 400, "Invalid stock");
    }
  }
  // Validazione Boolean
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return sendError(res, 400, "Invalid isActive value");
  }

  // Validazione condizionale di categoryId (consente null per rimuovere una categoria o un ID esistente)
  let parsedCategoryId;
  if (categoryId !== undefined) {
    if (categoryId === null) {
      parsedCategoryId = null;
    } else {
      parsedCategoryId = Number(categoryId);
      if (!Number.isInteger(parsedCategoryId)) {
        return sendError(res, 400, "Invalid categoryId");
      }
      // Cerco se l'ID della categoria fornito è presente nel database
      const category = await prisma.category.findUnique({
        where: {id: parsedCategoryId},
      });
      // Controllo l'esistenza della categoria e restituisco errore se non trovo nulla
      if (!category) {
        return sendError(res, 404, "Category not valid");
      }
    }
  }

  // Prisma ignora le proprietà che rimangono in undefined
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: name !== undefined ? name.trim() : undefined,
      brand: brand !== undefined ? brand.trim() : undefined,
      description: description !== undefined ? isStringValid(description) ? description.trim() : null : undefined,
      price: parsedPrice,
      stock: parsedStock,
      isActive: isActive,
      categoryId: parsedCategoryId,
    }
  })

  const body = req.body;
  console.log(body);
  res.send(`Aggionamento del prodotto con id: ${id}`);
});

// DESTROY - Eliminazione di un prodotto (DELETE /products/:id)
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Validazione formato numerico intero
  if (!Number.isInteger(id)) {
    return sendError(res, 400, "Invalid product ID");
  }

  // Controlliamo se il prodotto esiste prima di eliminarlo
  const product = await prisma.product.findUnique({
    where: { id },
  });
  // Controllo l'esistenza della risorsa e restituisco errore se non trovo nulla
  if (!product) {
    return sendError(res, 404, "Product not found");
  }

  await prisma.product.delete({
    where: { id },
  });

  // res.send(`Eliminazione del prodotto con id: ${id}`);
  res.sendStatus(204);
});

export default router;
