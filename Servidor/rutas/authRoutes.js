const express = require('express');
const {registrarUsuario, login} = require('../controladores/authController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();
const RevokedToken = require("../modelos/RevokedToken");

//Rutas
router.post("/register", registrarUsuario);
router.post("/login", login);

//Rutas protegidas (perfil de usuario)
router.get("/perfil",authMiddleware, (req, res) => {
    res.json({msg: "Perfil de usuario", usuario: req.usuario});
});

// Logout: Guardar el token en la base de datos para revocarlo
router.post("/logout", authMiddleware, async (req, res) => {
    try{
        const token = req.header("Authorization").split(" ")[1];

        //guardar el token en la BD
        await RevokedToken.create({token});
        
        res.json({msg: "Sesion cerrada correctamente"});

    }catch(error){
        res.status(500).json({msg: "Hubo un error en el servidor", error});
    }
})

module.exports = router;