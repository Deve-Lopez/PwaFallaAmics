import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebaseConfig";
import { ref, onValue, set, remove, update } from "firebase/database";
import imageCompression from "browser-image-compression";
import BottomNav from "../../components/BottomNav/BottomNav";
import { getLocalSession } from "../../services/authService";
import "./EventoDetalle.css";

const OPCIONES_ASISTENCIA = [
  { id: "1a", label: "1 Adult", adultos: 1, ninos: 0 },
  { id: "1a1n", label: "1 Adult + 1 Xiquet", adultos: 1, ninos: 1 },
  { id: "1a2n", label: "1 Adult + 2 Xiquets", adultos: 1, ninos: 2 },
  { id: "2a", label: "2 Adults", adultos: 2, ninos: 0 },
  { id: "2a1n", label: "2 Adults + 1 Xiquet", adultos: 2, ninos: 1 },
  { id: "2a2n", label: "2 Adults + 2 Xiquets", adultos: 2, ninos: 2 },
];

function EventoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [miAsistencia, setMiAsistencia] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("1a");
  const [selectorVisible, setSelectorVisible] = useState(false);

  const [totalAdultos, setTotalAdultos] = useState(0);
  const [totalNinos, setTotalNinos] = useState(0);
  const [totalPersonas, setTotalPersonas] = useState(0);

  // ADMIN STATES
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEvent, setEditEvent] = useState({
    title: '',
    start: '',
    description: '',
    fotoEvento: ''
  });

  const user = getLocalSession();
  const userId = user?.id || "anonimo";
  const isAdmin = user?.Rol === "Administrador";

  useEffect(() => {
    const eventoRef = ref(db, `Eventos/${id}`);
    const unsubscribe = onValue(eventoRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      setEvento(data);
      const asistentes = data.asistentes || {};
      let adultos = 0, ninos = 0;
      Object.values(asistentes).forEach((a) => {
        adultos += a.adultos || 0;
        ninos += a.ninos || 0;
      });
      setTotalAdultos(adultos);
      setTotalNinos(ninos);
      setTotalPersonas(adultos + ninos);
      if (asistentes[userId]) {
        setMiAsistencia(asistentes[userId]);
        setOpcionSeleccionada(asistentes[userId].opcionId || "1a");
      } else {
        setMiAsistencia(null);
      }
    });
    return () => unsubscribe();
  }, [id, userId]);

  // ASISTENCIA
  const confirmarAsistencia = async () => {
    const opcion = OPCIONES_ASISTENCIA.find((o) => o.id === opcionSeleccionada);
    setLoading(true);
    await set(ref(db, `Eventos/${id}/asistentes/${userId}`), {
      nombre: user?.Nombre || "Faller",
      opcionId: opcion.id,
      label: opcion.label,
      adultos: opcion.adultos,
      ninos: opcion.ninos,
      fecha: new Date().toISOString(),
    });
    setSelectorVisible(false);
    setLoading(false);
  };

  const cancelarAsistencia = async () => {
    setLoading(true);
    await remove(ref(db, `Eventos/${id}/asistentes/${userId}`));
    setMiAsistencia(null);
    setSelectorVisible(false);
    setLoading(false);
  };

  // EDICIÓN
  const openEditModal = () => {
    setEditEvent({
      title: evento.title,
      start: evento.start,
      description: evento.description || '',
      fotoEvento: evento.fotoEvento || ''
    });
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleEditFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressed = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressed);
      reader.onloadend = () => {
        setEditEvent({ ...editEvent, fotoEvento: reader.result });
      };
    } catch (error) {
      alert("Error al processar la imatge");
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await update(ref(db, `Eventos/${id}`), editEvent);
      setShowEditModal(false);
    } catch (error) {
      alert("Error al actualizar l'acte");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Segur que vols eliminar aquest acte?")) return;
    try {
      await remove(ref(db, `Eventos/${id}`));
      navigate("/calendari");
    } catch (error) {
      alert("Error al eliminar l'acte");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressed = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressed);
      reader.onloadend = async () => {
        await update(ref(db, `Eventos/${id}`), { fotoEvento: reader.result });
        setImgLoading(false);
      };
    } catch {
      setImgLoading(false);
      alert("Error al pujar la foto.");
    }
  };

  if (!evento) return <div className="ed-loading"><div className="ed-spinner"></div><span>Carregant...</span></div>;

  const opcionActual = OPCIONES_ASISTENCIA.find((o) => o.id === opcionSeleccionada);

  return (
    <div className="ed-screen">
      <BottomNav active="calendari" />

      <div className="ed-scroll">
        {/* HERO - SIEMPRE LA FOTO FIJA */}
        <div className="ed-hero">
          <img
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000"
            alt="Capçalera Falla"
          />
          <div className="ed-hero-overlay"></div>
          <button className="ed-back-btn" onClick={() => navigate(-1)}>
            <i className="ti ti-arrow-left"></i>
          </button>

          {isAdmin && (
            <div className="ed-hero-menu">
              <button className="ed-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                <i className="ti ti-dots-vertical"></i>
              </button>
              {showMenu && (
                <div className="ed-menu-dropdown">
                  <button className="ed-menu-item" onClick={openEditModal}><i className="ti ti-edit"></i> Editar acte</button>
                  <button className="ed-menu-item danger" onClick={handleDeleteEvent}><i className="ti ti-trash"></i> Eliminar acte</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="ed-body">
          <h1 className="ed-title">{evento.title}</h1>
          
          <div className="ed-stats-row">
            <div className="ed-stat-pill"><i className="ti ti-users"></i><span><strong>{totalPersonas}</strong> persones</span></div>
            {totalAdultos > 0 && <div className="ed-stat-pill secondary"><i className="ti ti-user"></i><span>{totalAdultos} adults</span></div>}
            {totalNinos > 0 && <div className="ed-stat-pill secondary"><i className="ti ti-mood-kid"></i><span>{totalNinos} xiquets</span></div>}
          </div>

          <div className="ed-info-block">
            <div className="ed-info-icon purple"><i className="ti ti-calendar"></i></div>
            <div>
              <div className="ed-info-label">DATA I HORA</div>
              <div className="ed-info-value">{new Date(evento.start).toLocaleString('ca-ES')}</div>
            </div>
          </div>

          <div className="ed-section">
            <h3 className="ed-section-title">Descripció</h3>
            <p className="ed-section-text">{evento.description || "Sense descripció disponible."}</p>
          </div>

          <div className="ed-section">
            <h3 className="ed-section-title">Fotos</h3>
            {evento.fotoEvento ? (
              <div className="ed-photo-frame"><img src={evento.fotoEvento} alt="evento" /></div>
            ) : (
              <div className="ed-no-photo">Sense fotos</div>
            )}
            {isAdmin && (
              <label className="ed-upload-btn">
                <i className="ti ti-camera"></i>
                {imgLoading ? "Processant..." : "Afegir/Canviar foto"}
                <input type="file" hidden onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* ACCIONES ASISTENCIA */}
      <div className="ed-action-bar">
        {miAsistencia ? (
          <div className="ed-confirmed-row">
            <div className="ed-confirmed-info">
              <div className="ed-confirmed-badge"><i className="ti ti-check"></i></div>
              <div><div className="ed-confirmed-label">Estàs apuntat</div><div className="ed-confirmed-sub">{miAsistencia.label}</div></div>
            </div>
            <button className="ed-btn-cancel" onClick={cancelarAsistencia} disabled={loading}>Cancel·lar</button>
          </div>
        ) : selectorVisible ? (
          <div className="ed-selector-panel">
            <div className="ed-selector-header"><span>Amb qui vens?</span><button onClick={() => setSelectorVisible(false)}><i className="ti ti-x"></i></button></div>
            <div className="ed-options-list">
              {OPCIONES_ASISTENCIA.map((op) => (
                <button key={op.id} className={opcionSeleccionada === op.id ? "selected" : ""} onClick={() => setOpcionSeleccionada(op.id)}>{op.label}</button>
              ))}
            </div>
            <button className="ed-btn-confirm" onClick={confirmarAsistencia} disabled={loading}>Confirmar — {opcionActual?.label}</button>
          </div>
        ) : (
          <div className="ed-cta-row">
            <div className="ed-cta-text"><p>T'apuntes a l'acte?</p><span>Confirma la teua assistència</span></div>
            <button className="ed-btn-primary" onClick={() => setSelectorVisible(true)}>Apuntar-me</button>
          </div>
        )}
      </div>

      {/* MODAL EDICIÓN REUTILIZADO */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Editar Esdeveniment</h3>
            <form onSubmit={handleUpdateEvent}>
              <label>Títol de l'acte</label>
              <input type="text" value={editEvent.title} required onChange={e => setEditEvent({...editEvent, title: e.target.value})} />
              <label>Data i Hora</label>
              <input type="datetime-local" value={editEvent.start} required onChange={e => setEditEvent({...editEvent, start: e.target.value})} />
              <label>Cartell / Foto (opcional)</label>
              <input type="file" accept="image/*" className="file-input" onChange={handleEditFileChange} />
              <label>Descripció</label>
              <textarea value={editEvent.description} onChange={e => setEditEvent({...editEvent, description: e.target.value})} />
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Tancar</button>
                <button type="submit" className="btn-save" disabled={loading}>{loading ? "Guardant..." : "Guardar Canvis"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventoDetalle;