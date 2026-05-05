import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalSession } from "../../services/authService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Verificación de sesión
    const savedUser = getLocalSession();
    if (savedUser) {
      setUser(savedUser);
    } else {
      navigate("/");
    }

    // 2. Escuchar cambio de tamaño de pantalla
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  if (!user) {
    return <div className="loading-screen">Carregant Casal...</div>;
  }

  return (
    <div className="home-container">
      {/* CAPA DEL VIDEO */}
      <div className="video-wrapper">
        <video
          key={isMobile ? "mobile-vid" : "desktop-vid"}
          autoPlay
          muted
          loop
          playsInline
          className="video-element"
        >
          <source
            src={isMobile ? "/videos/VideoFallasMovil2.mp4" : "/videos/VideoFallas.mp4"}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Capa oscura para que el texto resalte */}
        <div className="video-overlay"></div>
      </div>

      {/* CONTENIDO POR ENCIMA DEL VIDEO */}
      <div className="content-layout">
        <Navbar user={user} />

        <main className="main-content">
          <div className="glass-card-compact">
            <h3>Tauler d'Anuncis</h3>
            <p>Benvingut al nou Casal Virtual de la Falla Amics de Náquera.</p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Home;