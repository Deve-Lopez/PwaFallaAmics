// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Perfil from "./pages/Perfil/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        {/* La página principal es el Login */}
        <Route path="/" element={<Login />} />
        
        {/* La página de bienvenida es /home */}
        <Route path="/home" element={<Home />} />

        {/* Página del Perfil */}
        <Route path="/perfil" element={<Perfil/>} />
      </Routes>
    </Router>
  );
}

export default App;