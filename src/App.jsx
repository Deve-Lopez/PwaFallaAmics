// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Perfil from "./pages/Perfil/Perfil"
import Agenda from "./pages/Agenda/Agenda"
import Noticias from "./pages/Noticias/Noticias"

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

        {/* Página de Agenda */}
        <Route path="/agenda" element={<Agenda/>}/>

        {/* Página de Noticias */}
        <Route path="/noticias" element={<Noticias/>}/>
      </Routes>
    </Router>
  );
}

export default App;