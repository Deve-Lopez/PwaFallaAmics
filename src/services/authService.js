import { ref, get } from "firebase/database"; 
import { db } from "../firebase/firebaseConfig";

export const loginWithUser = async (dni, password) => {
  try {
    // Normalizamos el DNI a mayúsculas para que coincida con la Key de la DB
    const cleanDNI = dni.trim().toUpperCase();
    const userRef = ref(db, `Falleros/${cleanDNI}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      
      // Comparamos contraseña (puedes añadir .toLowerCase() si quieres que tampoco importe)
      if (userData.Contrasenya?.toString().trim() === password.trim()) {
        const userSession = { ...userData, id: cleanDNI };
        localStorage.setItem("user", JSON.stringify(userSession));
        return { user: userSession, error: null };
      }
      return { user: null, error: "Contrasenya incorrecta." };
    }
    return { user: null, error: "DNI no trobat." };
  } catch (err) {
    console.error("Error en authService:", err);
    return { user: null, error: "Error de connexió." };
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};