require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());//habilitamos que el servidor acepte peticiones de otros dominios
app.use(express.json());//habilitamos que el servidor pueda recibir datos en formato json

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_CONNECTION)
.then(() => console.log("Conectado a MongoDB"))
.catch((err) => console.error("Error al conectar a MongoDB" ,err));

// Rutas
app.get("/", (req, res) => {
    res.send("Hola Mundo");
});

//levantar el servidor

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});