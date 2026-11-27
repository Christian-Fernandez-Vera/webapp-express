import express from "express";

const router = express.Router();

// Utilities locali per centralizzare errori JSON e validazioni di base
const sendError = (res, status, message) =>
  res.status(status.json)({ error: message, status });
// Verifica che il valore sia una stringa non vuota (rimuovendo spazi bianchi)
const isStringValid = (value) =>
  typeof value === "string" && value.trim() !== "";

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
  });

  res.json(products);
  // res.send("Lista dei prodotti Quipurati");
});

// SHOW - Dettagli completi di un singolo prodotto con categoria inclusa (GET /api/products/:id)
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Validazione formato numerico
  if (!Number.isInteger(id)) {
    return sendError(res, 400, "Invalid product ID");
  }
  // Cerca il prodotto e include la categoria
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
    omit: { categoryId: true },
  });

  // Validazione esistenza della risorsa nel DB
  if (!product) {
    return sendError(res, 404, "Product not found");
  }
  // Se il prodotto viene trovato, lo restituisco in JSON
  res.json(product);
  // res.send(`Dettagli del prodotto con ID: ${id}`);
});

// STORE - Creazione di un nuovo prodotto (POST /products)
router.post("/", async (req, res) => {
  // Destrutturazione esplicita per non passare mai req.body direttamente a Prisma
  const { name, brand, description, price, stock, isActive, categoryId } =
    req.body || {};

  // Validazione campi testuali obbligatori
  if (!inStringValid(name) || !inStringValid(brand)) {
    return sendError(res, 400, "Name and brand are required");
  }

  // Validazione del prezzo obbligatorio (Decimal in schema.prisma)
  const parsedPrice = Number(price);
  if (
    price === undefined ||
    price === "" ||
    Number.isNaN(parsedPrice) ||
    parsedPrice < 0
  ) {
    return sendError(res, 400, "A valid price is required");
  }

  // Validazione categoryId se presente (nel nostro schema e opzionale)
  let parsedCategoryId = null;
  // Converto a numero solo se non è nullo o indefinito
  if (categoryId !== undefined && categoryId !== null) {
    parsedCategoryId = Number(categoryId);

    // Validazione formato numerico intero
    if (!Number.isInteger(parsedCategoryId)) {
      return sendError(res, 400, "Invalid categoryId");
    }
    //Controllo che la categoria esista nel database
    const category = await prisma.category.findUnique({
      where: { id: parsedCategoryId },
    });
    // Se la categoria non esiste, restituisco errore
    if (!category) {
      return sendError(res, 400, "Category ID not valid");
    }
  }
  // Creazione del prodotto
  const newProduct = await prisma.product.create({
    data: {
      name: name.trim(),
      brand: brand.trim(),
      description: isStringValid(description) ? description.trim() : null,
      price: parsedPrice,
      stock: stock !== undefined ? Boolean(isActive) : true,
      categoryId: parsedCategoryId,
    },
  });

  // const body = req.body;
  // console.log(body);
  // res.send(`Creazione di un nuovo prodotto Quipurati`);

  // Restituisco il prodotto appena creato con i suoi dati originali, più l'id generato automaticamente
  res.status(201).json(newProduct);
});

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





  res.send(`Eliminazione del prodotto con id: ${id}`);
});

export default router;
