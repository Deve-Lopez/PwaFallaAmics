import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer-container">

      <p className="footer-copy">
        © {new Date().getFullYear()} Falla Amics de Nàquera
      </p>

      <div className="redes-sociales">
        <a 
          href="https://www.instagram.com/falla_amics_naquera/" 
          target="_blank" 
          rel="noreferrer"
        >
          <FaInstagram />
        </a>

        <a 
          href="https://www.facebook.com/p/Falla-Amics-de-N%C3%A1quera-100064316606908/?locale=es_ES" 
          target="_blank" 
          rel="noreferrer"
        >
          <FaFacebook />
        </a>

        <a href="mailto:falla_amics_naquera@hotmail.com?subject=Contacto Falla Amics">
          <FaEnvelope />
        </a>
      </div>

    </div>
  );
}

export default Footer;