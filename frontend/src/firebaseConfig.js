// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkEOxGPwLj4-RSfw8zQPRJx0HrNTlgUFo",
  authDomain: "connect-stream.firebaseapp.com",
  projectId: "connect-stream",
  storageBucket: "connect-stream.firebasestorage.app",
  messagingSenderId: "742065915216",
  appId: "1:742065915216:web:9eba0096e24730ada2d855",
  measurementId: "G-GRR691NSLD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Commented out as not used

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
