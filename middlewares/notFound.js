function notFound(req, res, next) {
  res.status(404).json({
    error: "Not Found",
    message: "Rotta non trovata",
  });
}

export default notFound;