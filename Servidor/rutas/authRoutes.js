const express = require('express');
const {registrarUsuario, login, refreshTokenFuncion, logout} = require('../controladores/authController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();
const RevokedToken = require("../modelos/RevokedToken");

//Rutas
router.post("/register", registrarUsuario);
router.post("/login", login);
router.post("/refreshToken", refreshTokenFuncion);
router.post("/logout", authMiddleware, logout);

//Rutas protegidas (perfil de usuario)
router.get("/perfil",authMiddleware, (req, res) => {
    res.json({msg: "Perfil de usuario", usuario: req.usuario});
});


module.exports = router;