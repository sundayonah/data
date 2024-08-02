import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: 'AIzaSyA5iI0pEdUVRFRzF1wNirs7FKOC9VCIjEU',
   authDomain: 'imisi-data.firebaseapp.com',
   projectId: 'imisi-data',
   storageBucket: 'imisi-data.appspot.com',
   messagingSenderId: '167473842428',
   appId: '1:167473842428:web:78f4ec34b4d2892ff8af79',
};

// // Initialize Firebase
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const storage = getStorage(app);

// const db = getFirestore(app);

// export { db };

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db, storage }; // Export both Firestore and Firebase Storage instances
