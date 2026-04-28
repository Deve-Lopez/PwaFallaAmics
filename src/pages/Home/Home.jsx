import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout, getLocalSession } from "../../services/authService";
import "./Home.css";
import logoFalla from "../../assets/logofalla.png";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = getLocalSession(); // Obtenemos sesión descifrada
    if (savedUser) {
      setUser(savedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) return <div className="loading-screen">Carregant Casal...</div>;

  return (
    <div className="app-layout">
      <header className="home-header-modern">
        <div className="header-left-content">
          <div className="logo-container-small">
            <img src={logoFalla} alt="Logo Falla" className="nav-logo-img" />
          </div>
          <div className="welcome-text-group">
            <h1>
              {user.Genero === "Mujer" ? "Benvinguda" : "Benvingut"} a la Falla Amics de Nàquera
              <span className="user-name-style"> {user.Nombre}</span>
            </h1>            <p className="sub-header-text">Exercici Faller 2026/2027</p>
          </div>
        </div>

        <div className="header-right-content">
          <Link to="/perfil" className="avatar-nav-link">
            <div className="profile-circle-nav">
              {user.ImagenPerfil ? (
                <img src={user.ImagenPerfil} alt="Perfil" />
              ) : (
                <div className="avatar-placeholder-nav">👤</div>
              )}
            </div>
            <span className="profile-hint">Perfil</span>
          </Link>
        </div>
      </header>

      <main className="main-content">
        <div className="glass-card-compact">
          <h3>Tauler d'Anuncis</h3>
          <p>Benvingut al nou Casal Virtual de la Falla Amics de Náquera.</p>
        </div>

        <div className="spacer-40"></div>

        <button className="btn-logout-minimal" onClick={() => { logout(); navigate("/"); }}>
          Tancar Sessió
        </button>
      </main>
    </div>
  );
}

export default Home;