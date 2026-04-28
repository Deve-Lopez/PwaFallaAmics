import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import CryptoJS from "crypto-js";

// Llave maestra para el cifrado (Cámbiala por algo único)
const SECRET_KEY = "FallaAmicsNaquera_2026_SecureKey";

/**
 * Cifra y guarda la sesión en localStorage
 */
const saveEncryptedSession = (userData) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
  localStorage.setItem("session_vault", ciphertext);
};

/**
 * Descifra y obtiene la sesión activa
 */
export const getLocalSession = () => {
  const vault = localStorage.getItem("session_vault");
  if (!vault) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(vault, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Error al descifrar la sesión:", error);
    return null;
  }
};

export const loginWithUser = async (dni, password) => {
  try {
    const cleanDNI = dni.trim().toUpperCase();
    const userRef = ref(db, `Falleros/${cleanDNI}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      
      // Verificación de contraseña
      if (userData.Contrasenya?.toString().trim() === password.trim()) {
        
        // Extraemos la contraseña para no guardarla ni cifrada
        const { Contrasenya, ...safeData } = userData;
        const userSession = { ...safeData, id: cleanDNI };

        // Guardamos de forma cifrada
        saveEncryptedSession(userSession);
        
        return { user: userSession, error: null };
      }
      return { user: null, error: "Contrasenya incorrecta." };
    }
    return { user: null, error: "DNI no trobat." };
  } catch (err) {
    console.error("Error en login:", err);
    return { user: null, error: "Error de connexió." };
  }
};

export const logout = () => {
  localStorage.removeItem("session_vault");
};