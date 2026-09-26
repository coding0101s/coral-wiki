import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from "firebase/auth"

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
const password_check_input = document.getElementById("password-check-bar");
const signup_button = document.getElementById("signup-button");

const email_error = document.getElementById("email-error");
const password_error = document.getElementById("password-error");
const password_check_error = document.getElementById("password-check-error")

email_input.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        password_input.focus();
    }
});

password_input.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        password_check_input.focus();
    }
});

password_check_input.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        signup_button.dispatchEvent(new Event("click"));
    }
});

signup_button.addEventListener("click", async () => {
    const email = email_input.value.trim();
    const password = password_input.value.trim();
    const password_check = password_check_input.value.trim();

    email_error.textContent = "* ";
    password_error.textContent = "* ";
    password_check_error.textContent = "* ";

    if (email === "") {
        email_error.textContent += "이메일을 작성해주세요.";
        return;
    }

    if (password === "") {
        password_error.textContent += "비밀번호를 작성해주세요.";
        return;
    }

    if (password_check === "") {
        password_check_error.textContent += "비밀번호를 확인해주세요.";
        return;
    }

    if (password !== password_check) {
        console.log(password);
        console.log(password_check);

        password_check_error.textContent += "비밀번호가 서로 같지않습니다.";
        return;
    }

    let user;

    try {
        const result = await createUserWithEmailAndPassword(
            auth, email, password
        );

        const user = result.user;

        await sendEmailVerification(user);

        const box = document.querySelector(".main-div");

        box.querySelectorAll("*").forEach(element => {
            if (!element.closest(".logo-box")) {
                element.remove();
            }
        });

        const h1 = document.createElement("h1");
        h1.textContent = "이메일 인증을 완료해주세요.";

        box.appendChild(h1);

        while (true) {
            await user.reload();

            if (user.emailVerified) break;

            await new Promise(resolve =>
                setTimeout(async () => {
                    try {
                        await deleteUser(user);
                    } catch (error) {
                        h1.textContent = "알 수 없는 오류가 발생헀습니다.";
                    } finally {
                        resolve();
                    }
                }, 60000)
            );
        }

        email_input.value = "";
        password_input.value = "";
        password_check_input.value = "";

        window.location.href = "./login.html";
    } catch (error) {
        console.error(error.code, error.message);
    }
});