import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";

const navItems = [
  { id: "home",     label: "Inici",     icon: "ti-home",     path: "/home" },
  { id: "cal",      label: "Calendari", icon: "ti-calendar", path: "/calendari" },
  { id: "fallers",  label: "Fallers",   icon: "ti-users",    path: "/fallers" },
  { id: "perfil",   label: "Perfil",    icon: "ti-user",     path: "/perfil" },
];

function BottomNav({ active }) {
  const location = useLocation();

  const isActive = (item) => {
    if (active) return item.id === active;
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="bottom-nav" aria-label="Navegació principal">
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`nav-item ${isActive(item) ? "active" : ""}`}
          aria-current={isActive(item) ? "page" : undefined}
        >
          <i className={`ti ${item.icon}`} aria-hidden="true"></i>
          <span>{item.label}</span>
          {isActive(item) && <div className="nav-active-dot"></div>}
        </Link>
      ))}
    </nav>
  );
}

export default BottomNav;