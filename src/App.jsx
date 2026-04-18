// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* La página principal es el Login */}
        <Route path="/" element={<Login />} />
        
        {/* La página de bienvenida es /home */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;