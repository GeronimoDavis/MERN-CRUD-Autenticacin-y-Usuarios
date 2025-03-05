const express = require('express');
const {registrarUsuario} = require('../controladores/authController');

const router = express.Router();

//Ruta para registrar un usuario
router.post("/register", registrarUsuario);

module.exports = router;