import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { ref, update } from "firebase/database";
import { getLocalSession, logout } from "../../services/authService";
import imageCompression from "browser-image-compression";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CryptoJS from "crypto-js";
import "./Perfil.css";
import BackButton from "../../components/BackButton/BackButton";

const SECRET_KEY = "FallaAmicsNaquera_2026_SecureKey";

function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = getLocalSession();
    if (savedUser) setUser(savedUser);
    else navigate("/");
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    setLoading(true);
    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Actualizar Firebase
        await update(ref(db, `Falleros/${user.id}`), {
          ImagenPerfil: base64Image
        });

        // Actualizar estado y LocalStorage
        const updatedUser = { ...user, ImagenPerfil: base64Image };
        setUser(updatedUser);

        const ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(updatedUser),
          SECRET_KEY
        ).toString();

        localStorage.setItem("session_vault", ciphertext);
        setLoading(false);
      };
    } catch (error) {
      setLoading(false);
      alert("Error al actualizar la foto.");
    }
  };

  if (!user) return null;

  return (
    <div className="app-layout">
      {/* Fondo opcional: Puedes usar un degradado oscuro o el mismo video de la Home */}
      <div className="perfil-bg-overlay"></div>

      <Navbar user={user} showAvatar={false} />

      <BackButton />

      <main className="perfil-content">
        <div className="glass-card-profile">
          <h2 className="perfil-title">El meu Perfil</h2>
          
          <div className="avatar-edit-wrapper">
            <input
              type="file"
              id="up-profile"
              onChange={handleFileChange}
              accept="image/*"
              hidden
            />
            <label htmlFor="up-profile" className="avatar-large-label">
              <div className={`avatar-large-box ${loading ? "loading-active" : ""}`}>
                {user.ImagenPerfil ? (
                  <img src={user.ImagenPerfil} alt="Perfil" />
                ) : (
                  <span className="huge-icon">👤</span>
                )}
                {loading && <div className="spinner-overlay"></div>}
              </div>
              <div className="camera-overlay">
                <span>Canviar foto 📸</span>
              </div>
            </label>
          </div>

          <div className="user-details-list">
            <div className="detail-row">
              <label>DNI</label>
              <p>{user.id}</p>
            </div>
            <div className="detail-row">
              <label>Nom Complet</label>
              <p>{user.Nombre} {user.Apellidos}</p>
            </div>
            <div className="detail-row">
              <label>Càrrec</label>
              <span className="perfil-role-badge">
                {user.Rol || "Faller/a"}
              </span>
            </div>
          </div>

          <div className="perfil-actions">
            <button
              className="btn-logout-minimal"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Tancar Sessió
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Perfil;