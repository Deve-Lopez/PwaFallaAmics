import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithUser } from "../../services/authService";
import "./Login.css";

// IMPORTANTE: Asegúrate de que estas rutas a tus imágenes son correctas
import fondoFalla from "../../assets/bgfalla.jpeg"; 
import logoFalla from "../../assets/logofalla.png"; 

function Login() {
  const [dniInput, setDniInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { user, error: authError } = await loginWithUser(dniInput, password);

    if (user) {
      navigate("/home");
    } else {
      setError(authError);
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoFalla})` }}>
      <div className="login-overlay"></div>
      <div className="login-content">
        <img src={logoFalla} alt="Logo Falla" className="login-logo-custom" />
        <div className="login-card">
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>DNI del Faller</label>
              <input 
                type="text" 
                placeholder="Ej: 12345678X" 
                value={dniInput}
                // Convertimos a mayúsculas visualmente y en el estado
                onChange={(e) => setDniInput(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase' }} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Contrasenya</label>
              <input 
                type="password" 
                placeholder="••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn-login-red" disabled={loading}>
              {loading ? "Comprovant..." : "Entrar al Casal"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;