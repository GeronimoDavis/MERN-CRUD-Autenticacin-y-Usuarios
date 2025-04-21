import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registro from './paginas/Registro';
import Login from './paginas/Login';
import Inicio from './paginas/Inicio'; 
import Bienvenida from './paginas/Bienvenida';


function App() {

  return (
     <BrowserRouter>
      <Routes>
      <Route path="/" element={<Inicio />} /> {/* ✅ Ruta para "/" */}
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/bienvenida" element={<Bienvenida />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
