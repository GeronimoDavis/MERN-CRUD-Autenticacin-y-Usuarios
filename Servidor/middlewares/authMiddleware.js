const jwt = require("jsonwebtoken");
const RevokedToken = require("..modelos/RevokedToken");

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    //verificar si hay token
    if(!token){
        return res.status(401).json({msg: "No hay token, permiso no válido"}); 
    }

    try{
        //Extraer el token, lo separamos del "Bearer"
        const tokenSinBearer = token.split(" ")[1];

        // Verificar si el token está revocado en la base de datos
        const tokenRevocado = await RevokedToken.findOne({token: tokenSinBearer});
        if(tokenRevocado){
            return res.status(401).json({msg: "Token revocado, por favor inicia sesión nuevamente"});
        }

        //Verificar el token
        const TokenDecodificado = jwt.verify(tokenSinBearer, process.env.JWT_SECRET);
        req.usuario = TokenDecodificado;

        next();
    }catch(error){
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({msg: "Token expirado, por favor inicia sesión nuevamente"});
        }

        res.status(401).json({msg: "Token no valido"});
    }
}

module.exports = {authMiddleware};