import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLocalSession } from "../../services/authService";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
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

      {/* HEADER */}
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

      {/* CONTENT */}
      <main className="main-content">
        <div className="glass-card-compact">
          <h3>Tauler d'Anuncis</h3>
          <p>Benvingut al nou Casal Virtual de la Falla Amics de Náquera.</p>
        </div>

        <div className="spacer-40"></div>

      </main>

      {/* FOOTER */}
      <div className="footer-container">
        <p className="footer-copy">
          © {new Date().getFullYear()} Falla Amics de Nàquera
        </p>
        <div className="redes-sociales">
          <a href="https://www.instagram.com/falla_amics_naquera/" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://www.facebook.com/p/Falla-Amics-de-N%C3%A1quera-100064316606908/?locale=es_ESbook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
          <a href="mailto:falla_amics_naquera@hotmail.com?subject=Contacto Falla Amics"><FaEnvelope /></a>
        </div>
      </div>
    </div>
  );
}

export default Home;