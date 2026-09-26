import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

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
const auth = getAuth(app);

const email_input = document.getElementById("email-bar");
const password_input = document.getElementById("password-bar");
const login_button = document.getElementById("login-button");

const email_error = document.getElementById("email-error");
const password_error = document.getElementById("password-error");


email_input.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        password_input.focus();
    }
});

password_input.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        login_button.dispatchEvent(new Event("click"));
    }
});

login_button.addEventListener("click", () => {
    const email = email_input.value.trim();
    const password = password_input.value.trim();

    email_error.textContent = "* ";
    password_error.textContent = "* ";

    if (email === "") {
        email_error.textContent += "이메일을 작성해주세요.";
        return;
    }

    if (password === "") {
        password_error.textContent += "비밀번호를 작성해주세요.";
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
        if (!result.user.emailVerified) {
            console.log("asdf");
            const error = new Error("a");
            error.code = "auth/invalid-email";
            throw error;
        }

        email_input.value = "";
        password_input.value = "";

        window.location.href = "../index.html";
    })
    .catch((error) => {
        switch (error.code) {
            case "auth/invalid-credential":
            case "auth/invalid-email":
                email_error.textContent += "이메일 또는 비밀번호가 잘못됬습니다.";
                password_error.textContent += "이메일 또는 비밀번호가 잘못됬습니다.";
                break;
            case "auth/too-many-requests":
                email_error.textContent += "로그인 시도가 너무 많습니다.";
                break;
            default:
                email_error.textContent += error.code;
                password_error.textContent += error.message;
                break;
        }
    });
});