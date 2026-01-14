async function checkAuth() {
    try {
        await window.api.fetchUser();
    } catch (err) {
        console.warn('Utente non autenticato');
        window.location.replace('/login/login.html?reason=auth');
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        checkAuth();
    }
});

