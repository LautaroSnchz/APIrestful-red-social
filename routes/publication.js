const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");

//definir rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);

//Exportar router
module.exports = router;