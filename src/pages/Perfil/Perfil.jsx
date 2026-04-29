import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { ref, update } from "firebase/database";
import { getLocalSession } from "../../services/authService";
import imageCompression from "browser-image-compression";
import { logout } from "../../services/authService";

import CryptoJS from "crypto-js";
import "./Perfil.css";

const SECRET_KEY = "FallaAmicsNaquera_2026_SecureKey";

function Perfil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = getLocalSession();
        if (savedUser) setUser(savedUser);
        else navigate("/");
    }, [navigate]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.id) return;

        setLoading(true);
        try {
            const options = { maxSizeMB: 0.1, maxWidthOrHeight: 500, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();

            reader.readAsDataURL(compressedFile);
            reader.onloadend = async () => {
                const base64Image = reader.result;

                // Actualizar Firebase
                await update(ref(db, `Falleros/${user.id}`), { ImagenPerfil: base64Image });

                // Actualizar Estado y LocalStorage Cifrado
                const updatedUser = { ...user, ImagenPerfil: base64Image };
                setUser(updatedUser);

                const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(updatedUser), SECRET_KEY).toString();
                localStorage.setItem("session_vault", ciphertext);

                setLoading(false);
            };
        } catch (error) {
            setLoading(false);
            alert("Error al actualizar la foto.");
        }
    };

    if (!user) return null;

    return (
        <div className="perfil-page">
            <header className="perfil-nav">
                <button className="btn-back" onClick={() => navigate("/home")}>← Tornar</button>
                <h2>Configuració del Perfil</h2>
            </header>

            <main className="perfil-content">
                <div className="perfil-card-main">
                    <div className="avatar-edit-wrapper">
                        <input type="file" id="up-profile" onChange={handleFileChange} hidden />
                        <label htmlFor="up-profile" className="avatar-large-label">
                            <div className={`avatar-large-box ${loading ? 'loading-spin' : ''}`}>
                                {user.ImagenPerfil ? <img src={user.ImagenPerfil} alt="Perfil" /> : <span className="huge-icon">👤</span>}
                            </div>
                            <div className="camera-overlay">Toca per a canviar foto 📸</div>
                        </label>
                    </div>

                    <div className="user-details-list">
                        <div className="detail-row">
                            <label>DNI</label>
                            <p>{user.id}</p>
                        </div>
                        <div className="detail-row">
                            <label>Nom</label>
                            <p>{user.Nombre} {user.Apellidos}</p>
                        </div>
                        <div className="detail-row">
                            <label>Càrrec</label>
                            <span className="perfil-role-badge">{user.Rol || "Faller/a"}</span>
                        </div>
                    </div>
                </div>
            </main>

            <button className="btn-logout-minimal" onClick={() => { logout(); navigate("/"); }}>
                Tancar Sessió
            </button>

        </div>
    );
}

export default Perfil;