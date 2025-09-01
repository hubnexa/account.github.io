const firebaseConfig = {
    apiKey: "AIzaSyAdQ6nI-bspXeVQ4S1-vQjyDOrqr55tGpA",
    authDomain: "nexahub-aa4e7.firebaseapp.com",
    projectId: "nexahub-aa4e7",
    storageBucket: "nexahub-aa4e7.firebasestorage.app",
    messagingSenderId: "564437910728",
    appId: "1:564437910728:web:a2fb26d5c2bfdb64e751fd"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const userNameEl = document.getElementById("userName");
const displayUsername = document.getElementById("displayUsername");
const displayEmail = document.getElementById("displayEmail");
const displayUID = document.getElementById("displayUID");
const dropdown = document.getElementById("dropdown");
const logoutBtn = document.getElementById("logoutBtn");
const errorBox = document.getElementById("errorBox");

auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const doc = await db.collection("users").doc(user.uid).get();
            const userData = doc.data();

            userNameEl.textContent = userData.username;
            displayUsername.textContent = userData.username;
            displayEmail.textContent = user.email;
            displayUID.textContent = user.uid;

        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    } else {
        document.querySelector(".account-box").classList.add("hidden");
        errorBox.classList.remove("hidden");
    }
});

// Mostrar/ocultar dropdown al hacer click en el nombre
document.querySelector(".user-menu").addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
});

// Cerrar sesión
logoutBtn.addEventListener("click", async () => {
    try {
        await auth.signOut();
        window.location.href = "../login";
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
    }
});
