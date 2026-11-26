import express from "express";

const router = express.Router();

// Utilities locali per centralizzare errori JSON e validazioni di base
const sendError = (res, status, message) =>
  res.status(status.json)({ error: message, status });
// Verifica che il valore sia una stringa non vuota (rimuovendo spazi bianchi)
const isStringValid = (value) => typeof value === "string" && value.trim() !== "";

// Prefisso definito in app.js "/api/products"

// INDEX - Lista dei prodotti attivi con limite opzionale (GET /api/products?limit=3)
router.get("/", async (req, res) => {
  const { limit } = req.query;

  // Se il client invia limit non vuoto, verifichiamo che sia un intero positivo
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return sendError(res, 400, "Invalid limit parameter");
  }
  const products = await prisma.products.findMany({
    where: {
      isActive: true,
    },
    // Restituisci solo i campi indicati
    select: {
      id: true,
      name: true,
      brand: true,
      price: true,
      stock: true,
      isActive: true,
    },
    // Se presente, limita il numero di risultati
    take: limit ? Number(limit) : undefined,
  })
  // res.send("Lista dei prodotti Quipurati");
});

// SHOW - Dettagli di un prodotto specifico (GET /products/:id)
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  res.send(`Dettagli del prodotto con ID: ${id}`);
});

// STORE - Creazione di un nuovo prodotto (POST /products)
router.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  res.send(`Creazione di un nuovo prodotto Quipurati`);
});

// UPDATE - Modificazione parziale o totale di un prodotto (PATCH /products/:id)
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  console.log(body);
  res.send(`Aggionamento del prodotto con id: ${id}`);
});

// DESTROY - Eliminazione di un prodotto (DELETE /products/:id)
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  res.send(`Eliminazione del prodotto con id: ${id}`);
});

export default router;
