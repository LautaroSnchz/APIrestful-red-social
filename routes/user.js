const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const check = require('../middlewares/auth');
const multer = require("multer");

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/");  // Aquí usamos cb para indicar el destino
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);  // Aquí usamos cb para indicar el nombre del archivo
    }
});

const uploads = multer({ storage });

// Rutas relacionadas con los usuarios
router.get('/profile/:id', check.auth, UserController.profile);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/prueba', UserController.pruebaUser);
router.get('/list/:page?', check.auth, UserController.list);
router.put("/update/", check.auth, UserController.update);
router.post("/upload", [check.auth, uploads.single("file0")], UserController.upload);

module.exports = router;
