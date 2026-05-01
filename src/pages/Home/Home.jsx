import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalSession } from "../../services/authService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = getLocalSession();
    if (savedUser) setUser(savedUser);
    else navigate("/");
  }, [navigate]);

  if (!user) return <div className="loading-screen">Carregant Casal...</div>;

  return (
    <div className="app-layout">

      <Navbar user={user} />

      <main className="main-content">
        <div className="glass-card-compact">
          <h3>Tauler d'Anuncis</h3>
          <p>Benvingut al nou Casal Virtual de la Falla Amics de Náquera.</p>
        </div>
      </main>

      <Footer />

    </div>
  );
}

export default Home;