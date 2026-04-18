import { db } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

// Esta función se encarga de "escuchar" cualquier parte de la base de datos
export const suscribirseAData = (callback) => {
  const dbRef = ref(db, "/");
  
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data); // Le pasamos los datos a quien los pidió
  });
};