// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Calendari from "./pages/Calendari/Calendari";
import Fallers from "./pages/Fallers/Fallers";
import Perfil from "./pages/Perfil/Perfil";
import EventoDetalle from "./pages/EventoDetalle/EventoDetalle";

function App() {
  return (
    <Router>
      <Routes>
        {/* La página principal es el Login */}
        <Route path="/" element={<Login />} />
        
        {/* La página de bienvenida es /home */}
        <Route path="/home" element={<Home />} />

        {/* Página del Perfil */}
        <Route path="/calendari" element={<Calendari/>} />

        {/* Página del evento */}
        <Route path="/calendari/evento/:id" element={<EventoDetalle/>} />

        {/* Página de Agenda */}
        <Route path="/fallers" element={<Fallers/>}/>

        {/* Página de Noticias */}
        <Route path="/perfil" element={<Perfil/>}/>
      </Routes>
    </Router>
  );
}

export default App;