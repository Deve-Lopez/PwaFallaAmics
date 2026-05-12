import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from "../../firebase/firebaseConfig"; 
import { ref, onValue, push, set } from "firebase/database";
import imageCompression from "browser-image-compression"; // Importamos la librería
import BottomNav from "../../components/BottomNav/BottomNav";
import "./Calendari.css";

function Calendari() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [view, setView] = useState(window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el botón de guardado
  
  const [newEvent, setNewEvent] = useState({
    title: '', 
    start: '', 
    description: '', 
    color: '#D4537E', 
    fotoEvento: '' // Cambiamos imageUrl por fotoEvento
  });

  useEffect(() => {
    const handleResize = () => setView(window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth');
    window.addEventListener('resize', handleResize);
    
    const eventsRef = ref(db, 'Eventos');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setEvents(formatted);
      }
    });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // LÓGICA PARA PROCESAR LA IMAGEN ANTES DE GUARDAR
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, fotoEvento: reader.result });
      };
    } catch (error) {
      console.error("Error al comprimir imatge:", error);
    }
  };

  const handleEventClick = (info) => {
    navigate(`/calendari/evento/${info.event.id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventsRef = ref(db, 'Eventos');
      // Empujamos el nuevo evento con la imagen en Base64
      await set(push(eventsRef), newEvent);
      
      setShowAddModal(false);
      setNewEvent({ title: '', start: '', description: '', color: '#D4537E', fotoEvento: '' });
    } catch (error) { 
      console.error(error); 
      alert("Error al crear l'acte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <BottomNav active="calendari" />
      <main className="calendar-content">
        <h2 className="perfil-title">Calendari Faller</h2>
        <div className="glass-card-calendar">
          <FullCalendar
            key={view}
            plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
            initialView={view}
            locale="ca"
            events={events}
            headerToolbar={{ start: 'prev,next', center: 'title', end: '' }}
            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            eventClick={handleEventClick}
          />
        </div>

        <button className="fab-add" onClick={() => setShowAddModal(true)}>+</button>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Nou Esdeveniment</h3>
              <form onSubmit={handleSubmit}>
                <label>Títol de l'acte</label>
                <input type="text" placeholder="Ej: Proclamació" required 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                
                <label>Data i Hora</label>
                <input type="datetime-local" required 
                  onChange={e => setNewEvent({...newEvent, start: e.target.value})} />
                
                <label>Cartell / Foto de portada</label>
                <input type="file" accept="image/*" className="file-input"
                  onChange={handleImageChange} />
                
                {newEvent.fotoEvento && (
                  <div className="preview-mini">
                    <img src={newEvent.fotoEvento} alt="Preview" />
                  </div>
                )}

                <label>Descripció</label>
                <textarea placeholder="Detalls de l'acte..." 
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Tancar</button>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Creant..." : "Crear Acte"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Calendari;