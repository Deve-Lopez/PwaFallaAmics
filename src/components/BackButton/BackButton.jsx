import { useNavigate } from "react-router-dom";
import "./BackButton.css";

function BackButton({ destination = -1, text = "Tornar" }) {
  const navigate = useNavigate();

  return (
    <nav className="back-nav-container">
      <button className="back-btn-pill" onClick={() => navigate(destination)}>
        <span className="back-icon">←</span>
        <span className="back-text">{text}</span>
      </button>
    </nav>
  );
}

export default BackButton;