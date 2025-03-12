const Usuario = require("../modelos/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Funcion para geenerar tokens de acceso
const generarTokenAcceso = (usuarioId) => {
    return jwt.sign({usuarioId}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

//Funcion para generar Refresh token 
const generarTokenRefresh = (usuarioId) => {
    return jwt.sign({usuarioId}, process.env.JWT_SECRET_REFRESH, {expiresIn: "7d"});
}

const registrarUsuario = async (req, res) => {

    try{
        const{nombreUsuario, email, password} = req.body;

        //verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ email });
        if(existeUsuario){
            return res.status(400).json({msg: "El usuario ya existe"});
        }

        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);

        //Crear el nuevo usuario
        const nuevoUsuario = new Usuario({
            nombreUsuario,
            email,
            password: passwordEncriptado
        });

        await nuevoUsuario.save();

        //Crear el JWT 
        const tokenAcceso = generarTokenAcceso(nuevoUsuario._id);
        const refreshToken = generarTokenRefresh(nuevoUsuario._id);

        //Guardar el refresh token en la base de datos
        nuevoUsuario.refreshToken = refreshToken;
        await nuevoUsuario.save();

        res.status(201).json({msg: "Usuario creado correctamente", tokenAcceso, refreshToken});



    }catch(error){
        res.status(500).json({msg: "Hubo un error en el servidor", error});
    }

};

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        //Verificar si el usuario existe
        const usuarioExiste = await Usuario.findOne({email});
        if(!usuarioExiste){
            return res.status(400).json({msg:"Credenciales incorrectas"});
        }

        //Verificar si la contraseña es correcta
        const passwordValido = await bcrypt.compare(password, usuarioExiste.password);
        if(!passwordValido){
            return res.status(400).json({msg:"Credenciales incorrectas"});
        }

        //Crear el JWT
        const tokenAcceso = generarTokenAcceso(usuarioExiste._id);
        const refreshToken = generarTokenRefresh(usuarioExiste._id);

        //guardar token en la base de datos
        usuarioExiste.refreshToken = refreshToken;
        await usuarioExiste.save();

        res.status(200).json({msg: "Inicio de sesión exitoso", tokenAcceso, refreshToken});

    }catch(error){
        res.status(500).json({msg: "Hubo un error en el servidor", error});

    }
}

//Refresh token 
const refreshTokenFuncion = async (req, res) => {
    try{

        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(401).json({msg: "No hay token, acceso no válido"});
        }

        //Buscar usuario con el refresh token
        const usuario = await Usuario.findOne({refreshToken});
        if(!usuario){
            return res.status(401).json({msg: "Token no válido"});
        }

        //verificar el refresh token
        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (error, decoded) => {
            if(error){
                return res.status(403).json({msg: "Token no válido"});
            }

            //Crear nuevo token de acceso
            const newtokenAcceso = generarTokenAcceso(usuario._id);
            res.status(200).json({newtokenAcceso});
        });
    }catch(error){
        res.status(500).json({msg: "Hubo un error en el servidor", error});
    }
}

//logout

const logout = async (req, res) => {
    try{
        const usuario = await Usuario.findById(req.usuario.usuarioId);
        if(!usuario){
            return res.status(401).json({msg: "Usuario no encontrado"});
        }

        usuario.refreshToken = null;
        await usuario.save();

        res.status(200).json({msg: "Sesión cerrada correctamente"});
    }catch(error){
        res.status(500).json({msg: "Hubo un error en el servidor", error});
    }
}

module.exports = {registrarUsuario, login, refreshTokenFuncion, logout};