import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDwXEr4NoS2lMI43TT1Vhi_JZ2CzVBXQLQ",
    authDomain: "coral-wiki-4bd7c.firebaseapp.com",
    projectId: "coral-wiki-4bd7c",
    storageBucket: "coral-wiki-4bd7c.firebasestorage.app",
    messagingSenderId: "525655140159",
    appId: "1:525655140159:web:39c2b084b3cec2df4dd58a",
    measurementId: "G-VCCSKTTPR3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const login_button = document.getElementById('login-button');
const signup_button = document.getElementById('signup-button');

const querySnapshot = await getDocs(collection(db, "htmlfiles"));
querySnapshot.forEach((doc) => {
    const data = doc.data();
    document.getElementById('main-div').innerHTML = data.content;
});

login_button.addEventListener('click', () => {
    window.location.href = "auth/login.html";
});

signup_button.addEventListener('click', () => {
    window.location.href = "auth/signup.html";
});