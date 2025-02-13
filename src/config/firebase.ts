
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1uDnkZ72ufxPdEIfssD2zIzZvKrT1_-4",
  authDomain: "lovable-clone.firebaseapp.com",
  projectId: "lovable-clone",
  storageBucket: "lovable-clone.appspot.com",
  messagingSenderId: "854325994917",
  appId: "1:854325994917:web:cbf55e2cbba8b04e41fa1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
