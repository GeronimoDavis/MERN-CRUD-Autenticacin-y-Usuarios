import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-6">¡Bienvenido!</h1>
        <p className="mb-4 text-gray-700">¿Aún no tenés cuenta?</p>
        <button
          onClick={() => navigate("/registro")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Inicio;