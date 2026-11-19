import express from "express";

const router = express.Router();

// Prefisso definito in app.js "/api/products"

// INDEX - Lista di tutti i prodotti (GET /products)
router.get('/', (req, res) => {
    res.send('Lista dei prodotti Quipurati');
});

// SHOW - Dettagli di un prodotto specifico (GET /products/:id)
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    res.send(`Dettagli del prodotto con ID: ${id}`);
});

export default router;