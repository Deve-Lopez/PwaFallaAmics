import "./SubNavbar.css";

function SubNavbar() {
  const menuItems = [
    { id: "cal", label: "CALENDARI", icon: "📅" },
    { id: "lot", label: "LOTERÍA", icon: "🎟️" },
    { id: "quo", label: "QUOTES", icon: "💰" },
    { id: "cens", label: "CENS", icon: "👥" },
  ];

  return (
    <div className="sub-navbar-container">
      <div className="sub-navbar-content">
        {menuItems.map((item) => (
          <button key={item.id} className="sub-nav-item">
            <span className="sub-nav-icon">{item.icon}</span>
            <span className="sub-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SubNavbar;