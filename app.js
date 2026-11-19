import express from "express";
import productsRouter from "./routers/products.js"

// Sezione principale del server Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware per parsare JSON e URL-encoded body requests
app.use(express.json());

// Ruta principale del server
app.get('/', (req, res) => {
  res.send('Quipurati API - Home Page');
});

// Registro del router di prodotti
app.use('/products', productsRouter);

// Server listening port
app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});