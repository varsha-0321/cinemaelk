
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBnb2wWE8zqjks1KYuBmNV73sSm02O_CGI",
  authDomain: "cinemaelk-d7fb7.firebaseapp.com",
  projectId: "cinemaelk-d7fb7",
  storageBucket: "cinemaelk-d7fb7.appspot.com",
  messagingSenderId: "441081080831",
  appId: "1:441081080831:web:91bf3f78b6fe7a94f855ca",
  measurementId: "G-LFCWSH5MXZ"
};


const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore(app);
export const storage = getStorage(app);