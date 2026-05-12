import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLocalSession } from "../../services/authService";
import BottomNav from "../../components/BottomNav/BottomNav";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = getLocalSession();
    if (savedUser) {
      setUser(savedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <span>Carregant Casal...</span>
      </div>
    );
  }

  const quickItems = [
    {
      id: "cal",
      label: "Calendari",
      sub: "Esdeveniments",
      icon: "ti-calendar",
      color: "pink",
      path: "/calendari",
    },
    {
      id: "lot",
      label: "Loteria",
      sub: "Compra els teus números",
      icon: "ti-ticket",
      color: "amber",
      path: "/loteria",
      badge: true,
    },
    {
      id: "quo",
      label: "Quotes",
      sub: "Gestió de pagaments",
      icon: "ti-coin",
      color: "teal",
      path: "/quotes",
    },
    {
      id: "cens",
      label: "Fallers",
      sub: "Cens de membres",
      icon: "ti-users",
      color: "purple",
      path: "/fallers",
    },
  ];

  const events = [
    { day: "15", month: "Mar", name: "Plantà", loc: "Carrer principal · 08:00h" },
    { day: "19", month: "Mar", name: "Cremà", loc: "Plaça de la Falla · 00:00h" },
  ];

  return (
    <div className="app-shell">

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-icon">
          <i className="ti ti-bell" aria-hidden="true"></i>
          <div className="notif-dot"></div>
        </div>
        <span className="top-bar-title">Exercici 2026/2027</span>
        <Link to="/perfil" className="top-bar-icon">
          <i className="ti ti-settings" aria-hidden="true"></i>
        </Link>
      </div>

      {/* AVATAR */}
      <div className="avatar-section">
        <div className="avatar-ring">
          {user?.ImagenPerfil ? (
            <img src={user.ImagenPerfil} alt="Perfil" className="avatar-img" />
          ) : (
            <i className="ti ti-user" aria-hidden="true"></i>
          )}
        </div>
        <div className="avatar-name">
          {user?.Genero === "Mujer" ? "Benvinguda" : "Benvingut"},{" "}
          <strong>{user?.Nombre}</strong>
        </div>
        <div className="avatar-sub">Falla Amics de Nàquera</div>
        <div className="level-pill">Faller actiu</div>
      </div>

            {/* BOTTOM NAV */}
      <BottomNav active="home" />


      {/* FEATURED BANNER */}
      <div className="featured-card">
        <div className="featured-eyebrow">Tauler d'Anuncis</div>
        <div className="featured-title">Casal Virtual de la Falla Amics de Náquera</div>
        <div className="featured-sub">Benvingut al nou espai digital</div>
      </div>

      {/* QUICK ACCESS */}
      <div className="section-label">Accés ràpid</div>
      <div className="quick-grid">
        {quickItems.map((item) => (
          <Link to={item.path} key={item.id} className="quick-card">
            {item.badge && <div className="quick-card-badge">!</div>}
            <div className={`quick-card-icon ${item.color}`}>
              <i className={`ti ${item.icon}`} aria-hidden="true"></i>
            </div>
            <div className="quick-card-name">{item.label}</div>
            <div className="quick-card-sub">{item.sub}</div>
          </Link>
        ))}
      </div>

      {/* UPCOMING EVENTS */}
      <div className="section-label">Pròxims esdeveniments</div>
      <div className="events-list">
        {events.map((ev, i) => (
          <div className="event-row" key={i}>
            <div className="event-date-box">
              <div className="event-day">{ev.day}</div>
              <div className="event-mon">{ev.month}</div>
            </div>
            <div className="event-info">
              <div className="event-name">{ev.name}</div>
              <div className="event-loc">{ev.loc}</div>
            </div>
            <i className="ti ti-chevron-right event-arrow" aria-hidden="true"></i>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;