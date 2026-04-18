import { ref, get, child } from "firebase/database"; 
import { db } from "../firebase/firebaseConfig";

export const loginWithUser = async (nombre, password) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'Falleros'));

    if (snapshot.exists()) {
      const falleros = snapshot.val();
      
      const userKey = Object.keys(falleros).find(key => {
        const u = falleros[key];
        
        // Comparación limpia y segura
        const matchNombre = u.Nombre?.trim().toLowerCase() === nombre.trim().toLowerCase();
        const matchPass = u.Contrasenya?.toString().trim().toLowerCase() === password.trim().toLowerCase();

        return matchNombre && matchPass;
      });

      if (userKey) {
        const userData = falleros[userKey];
        // Guardamos en el navegador para la sesión
        localStorage.setItem("user", JSON.stringify(userData));
        return { user: userData, error: null };
      }
      return { user: null, error: "Nombre o contraseña incorrectos" };
    }
    return { user: null, error: "No hay datos en el sistema" };
  } catch (err) {
    // Solo dejamos este log para errores técnicos (red, firebase caído, etc.)
    console.error("Error técnico en Login:", err.message); 
    return { user: null, error: "Error de conexión con el servidor" };
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};