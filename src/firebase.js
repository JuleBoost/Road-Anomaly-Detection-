import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyC-sWBioNBiHdYU-qpRPNEL_d5kB4zNLVQ",
  authDomain: "roadsense-864cc.firebaseapp.com",
  projectId: "roadsense-864cc",
  storageBucket: "roadsense-864cc.firebasestorage.app",
  messagingSenderId: "63597794880",
  appId: "1:63597794880:web:4c070d2614d50fa6f331a5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
