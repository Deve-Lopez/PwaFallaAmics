import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir
import { loginWithUser } from "../../services/authService";
import "./Login.css";
import fondoFalla from "../../assets/bgfalla.jpeg"; 
import logoFalla from "../../assets/logofalla.png"; 

function Login() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para feedback de carga

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setLoading(true);

    // Llamamos al servicio pasando los 3 datos requeridos
    const { user, error: loginError } = await loginWithUser(nombre, password);

    if (loginError) {
      setError(loginError);
      setLoading(false);
    } else {
      console.log("¡Benvingut!", user.Nombre);
      // Si todo está ok, redirigimos a la vista de inicio
      navigate("/home"); 
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoFalla})` }}>
      <div className="login-overlay"></div>

      <div className="login-content">
        <img src={logoFalla} alt="Logo Falla" className="login-logo-custom" />

        <div className="login-card">
          <form className="login-form" onSubmit={handleLogin}>
            
            <div className="input-group">
              <label>Nom</label>
              <input 
                type="text" 
                placeholder="Ej: Usuario" 
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Contrasenya</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn-login-red" disabled={loading}>
              {loading ? "Entrando..." : "Entrar al Casal"}
            </button>

          </form>

          {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;