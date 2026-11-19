import express from "express";

const router = express.Router();

// Prefisso definito in app.js "/api/products"

// INDEX - Lista di tutti i prodotti (GET /products)
router.get("/", (req, res) => {
  res.send("Lista dei prodotti Quipurati");
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
