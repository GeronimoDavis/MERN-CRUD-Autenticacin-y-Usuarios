const express = require('express');
const {registrarUsuario, login} = require('../controladores/authController');

const router = express.Router();

//Ruta para registrar un usuario
router.post("/register", registrarUsuario);
router.post("/login", login);


module.exports = router;