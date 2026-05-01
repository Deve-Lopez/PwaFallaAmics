import { Link } from "react-router-dom";
import logoFalla from "../../assets/logofalla.png";
import "./Navbar.css";

function Navbar({ user, showAvatar = true }) {
  return (
    <header className="home-header-modern">

      {/* IZQUIERDA */}
      <div className="header-left-content">

        {/* 🔥 LOGO CLICKABLE */}
        <Link to="/home" className="logo-container-small">
          <img src={logoFalla} alt="Logo Falla" className="nav-logo-img" />
        </Link>

        <div className="welcome-text-group">
          <h1>
            {user?.Genero === "Mujer" ? "Benvinguda" : "Benvingut"} a la Falla Amics de Nàquera
            <span className="user-name-style"> {user?.Nombre}</span>
          </h1>

          <p className="sub-header-text">
            Exercici Faller 2026/2027
          </p>
        </div>
      </div>

      {/* DERECHA */}
      {showAvatar && (
        <div className="header-right-content">
          <Link to="/perfil" className="avatar-nav-link">
            <div className="profile-circle-nav">
              {user?.ImagenPerfil ? (
                <img src={user.ImagenPerfil} alt="Perfil" />
              ) : (
                <div className="avatar-placeholder-nav">👤</div>
              )}
            </div>
            <span className="profile-hint">Perfil</span>
          </Link>
        </div>
      )}

    </header>
  );
}

export default Navbar;