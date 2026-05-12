import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebaseConfig"; 
import { ref, onValue, set, remove, update } from "firebase/database";
import imageCompression from "browser-image-compression";
import BottomNav from "../../components/BottomNav/BottomNav";
import "./EventoDetalle.css";

function EventoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [apuntado, setApuntado] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ID de usuario (Asegúrate de traerlo de tu sesión/contexto)
  const userId = "user123"; 

  useEffect(() => {
    const eventoRef = ref(db, `Eventos/${id}`);
    const unsubscribe = onValue(eventoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEvento(data);
        setApuntado(!!(data.asistentes && data.asistentes[userId]));
      }
    });
    return () => unsubscribe();
  }, [id, userId]);

  // LÓGICA DE COMPRESIÓN Y BASE64 (Igual que en Perfil.jsx)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const options = { 
        maxSizeMB: 0.1, 
        maxWidthOrHeight: 800, 
        useWebWorker: true 
      };
      
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onloadend = async () => {
        const base64Image = reader.result;
        
        // Guardamos en la clave 'fotoEvento' dentro de este evento específico
        await update(ref(db, `Eventos/${id}`), { 
          fotoEvento: base64Image 
        });

        setLoading(false);
      };
    } catch (error) {
      setLoading(false);
      alert("Error al pujar la foto de l'acte.");
    }
  };

  const toggleAsistencia = async () => {
    const asistenciaRef = ref(db, `Eventos/${id}/asistentes/${userId}`);
    if (apuntado) {
      await remove(asistenciaRef);
    } else {
      await set(asistenciaRef, { 
        nombre: "Faller Prova", 
        fecha: new Date().toISOString() 
      });
    }
  };

  if (!evento) return <div className="loading-state">Carregant acte...</div>;

  return (
    <div className="detail-screen">
      {/* Menú Superior fijo */}
      <BottomNav active="calendari" />
      
      <div className="scroll-content">
        <div className="detail-card">
          {/* Botones de acción sobre la imagen de cabecera */}
          <div className="header-overlay">
            <button className="back-btn" onClick={() => navigate(-1)}>←</button>
            <span className="event-tag" style={{backgroundColor: evento.color || '#3B82F6'}}>
              Acte Oficial
            </span>
          </div>

          {/* CABECERA FIJA (Imagen de stock) */}
          <div className="hero-img">
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000" 
              alt="Capçalera Falla" 
            />
          </div>

          <div className="info-container">
            <h1 className="title">{evento.title}</h1>
            <p className="stats">👥 {evento.asistentes ? Object.keys(evento.asistentes).length : 0} fallers apuntats</p>

            <div className="date-pill">
              <span className="icon">📅</span>
              <div>
                <small>DATA I HORA</small>
                <p>{new Date(evento.start).toLocaleString('ca-ES', { 
                  weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                })}</p>
              </div>
            </div>

            <div className="desc">
              <h3>Descripció</h3>
              <p>{evento.description || "Sense descripció disponible."}</p>
            </div>

            {/* SECCIÓN DE LA FOTO DEL EVENTO (BASE64) */}
            <div className="extra-photos">
              <h3>Fotos de l'acte</h3>
              
              {evento.fotoEvento ? (
                <div className={`photo-frame ${loading ? "loading-active" : ""}`}>
                  <img src={evento.fotoEvento} alt="Foto de l'acte" />
                </div>
              ) : (
                <div className="no-photo-placeholder">Encara no hi ha fotos de l'acte.</div>
              )}

              {/* Input idéntico al de tu perfil */}
              <label className="upload-btn">
                {loading ? "Processant..." : "📷 Afegir / Canviar Foto"}
                <input type="file" onChange={handleFileChange} hidden accept="image/*" />
              </label>
            </div>

            {/* Espaciador para que el scroll supere la barra flotante */}
            <div className="spacer"></div>
          </div>
        </div>
      </div>

      {/* BARRA FLOTANTE DE ACCIÓN (Ajustada para móvil) */}
      <div className="floating-action-bar">
        <div className="txt">
          <p>T'apuntes a l'acte?</p>
          <span>Confirma la teua assistència</span>
        </div>
        <button 
          className={`btn ${apuntado ? 'active' : ''}`}
          onClick={toggleAsistencia}
        >
          {apuntado ? "✓ Apuntat" : "Apuntar-me"}
        </button>
      </div>
    </div>
  );
}

export default EventoDetalle;