import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdqbxGBBa9pqOQWohWmwnseEpazpxULe",
  authDomain: "lintas-kelas-ti.firebaseapp.com",
  projectId: "lintas-kelas-ti",
  storageBucket: "lintas-kelas-ti.firebasestorage.app",
  messagingSenderId: "889814978685",
  appId: "1:889814978685:web:1b39987b886327712b8866"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Baris ini yang sebelumnya belum ada / terlewat:
export const db = getFirestore(app);