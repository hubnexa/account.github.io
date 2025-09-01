// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdQ6nI-bspXeVQ4S1-vQjyDOrqr55tGpA",
    authDomain: "nexahub-aa4e7.firebaseapp.com",
    projectId: "nexahub-aa4e7",
    storageBucket: "nexahub-aa4e7.firebasestorage.app",
    messagingSenderId: "564437910728",
    appId: "1:564437910728:web:a2fb26d5c2bfdb64e751fd",
    measurementId: "G-0JSNRY02QE"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Manejo de topbar y logout
const userNameEl = document.getElementById('userName');
const dropdown = document.getElementById('dropdown');
const logoutBtn = document.getElementById('logoutBtn');

userNameEl.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
});

logoutBtn.addEventListener('click', async () => {
    await auth.signOut();
    window.location.href = "../login";
});

// Mostrar bienvenida y preparar canje
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        document.body.innerHTML = `<div class="error-box">No hay sesión activa. Redirigiendo a login...</div>`;
        setTimeout(() => { window.location.href = "../login"; }, 2000);
        return;
    }

    const username = user.displayName || (await db.collection('users').doc(user.uid).get()).data()?.username || "Usuario";
    userNameEl.textContent = username;
    document.getElementById('welcome-message').textContent = `Bienvenido, ${username}!`;
});

// Canjear código con Firestore
const redeemBtn = document.getElementById('redeem-btn');
const redeemResult = document.getElementById('redeem-result');

redeemBtn.addEventListener('click', async () => {
    const codeInput = document.getElementById('gift-code').value.trim();
    if (!codeInput) {
        redeemResult.textContent = "Ingresa un código válido.";
        redeemResult.style.color = "#f87171";
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
        // Buscar el código en la colección "codes"
        const codesSnap = await db.collection('codes').where('CodeName', '==', codeInput).get();

        if (codesSnap.empty) {
            redeemResult.textContent = "Código inválido.";
            redeemResult.style.color = "#f87171";
            return;
        }

        const codeDoc = codesSnap.docs[0];
        const usedBy = codeDoc.data().usedBy || [];

        if (usedBy.includes(user.email)) {
            redeemResult.textContent = "Ya has usado este código.";
            redeemResult.style.color = "#f87171";
            return;
        }

        // Marcar como usado
        await db.collection('codes').doc(codeDoc.id).update({
            usedBy: [...usedBy, user.email]
        });

        redeemResult.textContent = "¡Código canjeado con éxito! 🎉";
        redeemResult.style.color = "#00ffcc";
        document.getElementById('gift-code').value = "";

    } catch (err) {
        console.error(err);
        redeemResult.textContent = "Error al canjear el código.";
        redeemResult.style.color = "#f87171";
    }
});
