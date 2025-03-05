const mongoose = require("mongoose");

const usuariosSchema = new mongoose.Schema({

    nombreUsuario:{
        type: String,
        required: true,
        unique: true,
        trim: true
    }, 

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password:{
        type: String,
        required: true,
    },

},{timestamps: true});

module.exports = mongoose.model("Usuario", usuariosSchema);