const Usuario = require("../modelos/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


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
        const token = jwt.sign(
            {usuarioId: nuevoUsuario._id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        res.status(201).json({msg: "Usuario creado correctamente", token});



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
        const token = jwt.sign(
            {usuarioId: usuarioExiste._id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        res.status(200).json({msg: "Inicio de sesión exitoso", token});

    }catch(error){
        res.status(500).json({msg: "Hubo un error en el servidor", error});

    }
}

module.exports = {registrarUsuario, login};