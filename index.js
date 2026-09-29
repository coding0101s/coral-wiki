import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

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
const auth = getAuth(app);

const logo = document.getElementById("logo");

const search_button = document.getElementById('search-button')

const login_button = document.getElementById('login-button');
const signup_button = document.getElementById('signup-button');
const account_button = document.getElementById('account-button');
const logout_button = document.getElementById('logout-button');

const account_menu = document.getElementById('account-menu');

const search_bar = document.getElementById("search-bar");

const querySnapshot = await getDocs(collection(db, "htmlfiles"));
querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.id === "산호위키") {
        document.getElementById('main-div').innerHTML = data.content;
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        login_button.hidden = true;
        signup_button.hidden = true;
        account_button.hidden = false;
    } else {
        login_button.hidden = false;
        signup_button.hidden = false;
        account_button.hidden = true;
    }
});

logo.addEventListener('click', () => {
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id === "산호위키") {
            document.getElementById('main-div').innerHTML = data.content;
        }
    });
});

search_button.addEventListener("click", () => {

    document.getElementById('main-div').innerHTML = ""

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (search_bar.value.trim() === "") {
            return;
        }

        if (data.id.toLowerCase().includes(search_bar.value.trim().toLowerCase())) {
            document.getElementById("main-div").innerHTML += `
                <div class="search-box sub-box" style="margin-bottom: 5px;">
                    <h1 class="search-box-title" data-id="${doc.id}">
                        ${data.id}
                    </h1>
                </div>
            `;
        }
    });

    if (document.getElementById('main-div').innerHTML === "") {
        document.getElementById('main-div').innerHTML = "일치하는 검색 결과가 없습니다."
    }
});

search_bar.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        search_button.dispatchEvent(new Event("click"));
    }
});

login_button.addEventListener('click', () => {
    window.location.href = "auth/login.html";
});

signup_button.addEventListener('click', () => {
    window.location.href = "auth/signup.html";
});

account_button.addEventListener("click", () => {
    account_menu.classList.toggle("hidden");
});

logout_button.addEventListener("click", async () => {
    await signOut(auth)
    account_menu.classList.toggle("hidden");
});

document.getElementById("main-div").addEventListener("click", (event) => {
    const title = event.target.closest(".search-box-title");

    if (!title) return;

    const docId = title.dataset.id;
    const targetDoc = querySnapshot.docs.find(doc => doc.id === docId);

    if (targetDoc) {
        document.getElementById("main-div").innerHTML =
            targetDoc.data().content;
    }
});