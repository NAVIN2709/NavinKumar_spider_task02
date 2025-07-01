import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{ getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEgW9TQugJ9lDj9DiY1J2lfr-kv373cp4",
  authDomain: "jugaadpay.firebaseapp.com",
  projectId: "jugaadpay",
  storageBucket: "jugaadpay.firebasestorage.app",
  messagingSenderId: "179570376540",
  appId: "1:179570376540:web:eebb2292b7b9497ff3cb99",
  measurementId: "G-VVWW1WWW0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export { auth }