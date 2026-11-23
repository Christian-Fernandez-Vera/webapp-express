import express from "express";
import productsRouter from "./routers/products.js"
import notFound from "./middlewares/notFound.js";
import errorsHandler from "./middlewares/errorsHandler.js";

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
// Lasciamo api/products in modo da poter aggiungere altre rotte in futuro come api/users, api/orders, etc.
// Dobbiamo ricordarci che in questo modo se avremo una rotta / in futuro dovremo usare /api/products/
app.use('/api/products', productsRouter);

// Middlewares di chiusura (sempre dopo tutti i percorsi)
app.use(notFound);
app.use(errorsHandler);

// Server listening port
app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});