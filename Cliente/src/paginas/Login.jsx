import { useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Bienvenida from "./Bienvenida"; // Asegúrate de importar el componente Bienvenida

const login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();
    
    //manjo de input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

    }

   //manejo del submit
   const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);//limpiar mensaje

        try{
            const {data} = await API.post("/api/auth/login", form);//enviar datos al backend
            console.log(data);
            setMensaje({tipo: "exito", texto: data.msg })//mensaje de exito

            localStorage.setItem("tokenAcceso", data.tokenAcceso);
            localStorage.setItem("refreshToken", data.refreshToken);

            setTimeout(() => navigate("/Bienvenida"), 1500); //redireccion a la pagina de bienvenida
        }
        catch(error){
            const errorMsg = error.response?.data?.msg || "Error al iniciar sesión";
            setMensaje({tipo: "error", texto: errorMsg});//mensaje de error
        }

   }

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Iniciar sesión
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="email">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ej: correo@ejemplo.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
          />
        </div>

        {mensaje && (
          <p
            className={`text-sm mb-4 ${
              mensaje.tipo === "exito" ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje.texto}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );

};

export default login;