import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPXqR02H9WqPi8C3QUPy2EIBeBaTsC8D4",
  authDomain: "gastos-45f94.firebaseapp.com",
  projectId: "gastos-45f94",
  storageBucket: "gastos-45f94.appspot.com",
  messagingSenderId: "742643546091",
  appId: "1:742643546091:web:720158831296061db28bae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
