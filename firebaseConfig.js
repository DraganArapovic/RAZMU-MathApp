import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXDcA7hZItW95TzjZHSbhL_35NB8p-FdQ",
    authDomain: "mathapp-c6e19.firebaseapp.com",
    projectId: "mathapp-c6e19",
    storageBucket: "mathapp-c6e19.appspot.com",
    messagingSenderId: "1056649401952",
    appId: "1:1056649401952:web:617da0b9976f083f371505"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };