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
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
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
