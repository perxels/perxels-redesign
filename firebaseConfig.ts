// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8_GaLbtXYurSl3YXiqmMOZQl70dSuioI",
  authDomain: "perxels-d6cf4.firebaseapp.com",
  projectId: "perxels-d6cf4",
  storageBucket: "perxels-d6cf4.appspot.com",
  messagingSenderId: "789102375886",
  appId: "1:789102375886:web:a7391df228dd8af277b19f",
  measurementId: "G-9NSH8Z6YME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
 const db = getFirestore(app);
 const storage = getStorage(app);

export { auth,db,storage, signInWithEmailAndPassword };