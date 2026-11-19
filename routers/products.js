import express from "express";

const router = express.Router();

// Prefisso definito in app.js "/api/products"

// INDEX - Lista di tutti i prodotti (GET /products)
router.get('/', (req, res) => {
    res.send('Lista dei prodotti Quipurati');
});