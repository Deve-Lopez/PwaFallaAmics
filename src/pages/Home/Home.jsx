import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig"; 
import { ref, update } from "firebase/database";
import { logout } from "../../services/authService";
import imageCompression from "browser-image-compression";
import "./Home.css";
import logoFalla from "../../assets/logofalla.png"; 

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    setLoading(true);
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 500, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        
        // Actualizamos en la ruta Falleros/DNI
        const userRef = ref(db, `Falleros/${user.id}`);
        await update(userRef, { ImagenPerfil: base64Image });

        const updatedUser = { ...user, ImagenPerfil: base64Image };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLoading(false);
        alert("¡Imatge actualitzada amb èxit!");
      };
    } catch (error) {
      console.error(error);
      alert("Error al pujar la imatge.");
      setLoading(false);
    }
  };

  if (!user) return <div className="loading-screen">Carregant Casal...</div>;

  return (
    <div className="app-layout">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <span className="nav-title">Falla Amics de Náquera</span>
          <div className="nav-actions">
            <button className="btn-logout-small" onClick={() => { logout(); navigate("/"); }}>
              Tancar Sessió
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* LOGO GRANDE */}
        <div className="brand-section">
          <img src={logoFalla} alt="Logo Falla" className="main-logo-large" />
        </div>

        <section className="profile-dashboard">
          <div className="welcome-banner">
            <h1>
               {user.Genero === "Mujer" ? "Benvinguda" : "Benvingut"}, {user.Nombre}
            </h1>
            <p>Panell de Faller - Exercici 2025/2026</p>
          </div>

          <div className="dashboard-grid">
            {/* TARJETA DE PERFIL (Carnet) */}
            <div className="glass-card profile-card">
              <div className="avatar-upload">
                <input type="file" id="up" accept="image/*" onChange={handleFileChange} hidden />
                <label htmlFor="up" className="avatar-label">
                  <div className={`avatar-container ${loading ? 'loading-spin' : ''}`}>
                    {user.ImagenPerfil ? (
                      <img src={user.ImagenPerfil} alt="Perfil" />
                    ) : (
                      <div className="avatar-placeholder">👤</div>
                    )}
                  </div>
                  <div className="edit-badge">📸</div>
                </label>
              </div>
              <div className="profile-info">
                <h2>{user.Nombre} {user.Apellidos}</h2>
                <span className="user-role-badge">{user.Rol || "Faller/a"}</span>
              </div>
            </div>

            {/* TARJETA DE INFORMACIÓN */}
            <div className="glass-card info-card">
              <h3>Dades Oficials</h3>
              <div className="info-list">
                <div className="info-item">
                  <label>DNI</label>
                  <span>{user.id}</span>
                </div>
                <div className="info-item">
                  <label>Comissió</label>
                  <span>Amics de Náquera</span>
                </div>
                <div className="info-item">
                  <label>Estat de quota</label>
                  <span className="status-pill">Actualitzat</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Falla Amics de Náquera</p>
          <div className="footer-links">
            <span>Privacitat</span>
            <span>Casal Virtual v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;