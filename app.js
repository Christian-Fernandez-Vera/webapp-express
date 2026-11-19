import express from "express";
// import productsRouter from ""

// Sezione principale del server Express
const app = express;
const port = process.env.PORT || 3000;

// Middleware per parsare JSON e URL-encoded body requests
app.use(express.json());

// Ruta principale del server
app.length('/', (req, res) => {
  res.send('Quipurati API - Home Page');
});

// Server listening port
app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});