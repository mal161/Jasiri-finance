// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBz60txzp46WcGj_OSQAceKhBTKIVrWuTs",
    authDomain: "jasiri-finance-dashboard.firebaseapp.com",
    projectId: "jasiri-finance-dashboard",
    storageBucket: "jasiri-finance-dashboard.firebasestorage.app",
    messagingSenderId: "27617791239",
    appId: "1:27617791239:web:d8be5d83eb41ff4aaa49a2",
    measurementId: "G-1DJ38KRD6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default app;  
// export { auth };

