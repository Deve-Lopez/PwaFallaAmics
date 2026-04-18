import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="home-container">
        <p>Cargando casal...</p>
      </div>
    );
  }

  // Normalizamos el género para evitar errores de mayúsculas
  const esHombre = user.Genero?.toLowerCase() === "hombre";

  return (
    <div className="home-container">
      <div className="home-card">
        
        <p className="welcome-text">
          {esHombre ? "¡Benvingut a la Falla!" : "¡Benvinguda a la Falla!"}
        </p>

        <h2 className="user-name">
          {user.Nombre} <br />
          {user.Apellidos}
        </h2>

        <div className="profile-img-container">
          {user.ImagenPerfil ? (
            <img 
              src={user.ImagenPerfil} 
              alt="Perfil" 
              className="profile-img" 
            />
          ) : (
            <div className="profile-placeholder">👤</div>
          )}
          
          <div className="user-badge">
            {esHombre ? "FALLER" : "FALLERA"}
          </div>
        </div>

        <div className="info-section">
          <p className="quote-text">
            "Amics de Nàquera, <br /> per molts anys!"
          </p>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Home;