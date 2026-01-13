// index.js
document.addEventListener('DOMContentLoaded', async () => {

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const title = document.querySelector('.topbar h1');
    const adminBtn = document.getElementById('adminBtn');
    const notificationBadge = document.getElementById('notificationBadge'); // aggiungi un badge in index.html se vuoi

    let isLogged = false;
    let userId = null;
    let username = null;

    // ---------------------------
    // Controllo sessione utente
    // ---------------------------
    try {
        const data = await window.api.fetchUser();
        isLogged = !!data.logged;
        userId = data.userId ?? null;
        username = data.username ?? null;
    } catch (err) {
        console.error('Errore controllo sessione:', err);
        isLogged = false;
    }

    if (isLogged) {
        loginBtn?.classList.add('hidden');
        logoutBtn?.classList.remove('hidden');
        if (title) title.innerText = `BENVENUTO, ${username}`;
    } else {
        loginBtn?.classList.remove('hidden');
        logoutBtn?.classList.add('hidden');
        if (title) title.innerText = `BENVENUTO`;
    }

    // ---------------------------
    // Click sulle card
    // ---------------------------
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;

            if (action === 'todo') {
                if (!isLogged) {
                    window.location.href = '/login/login.html';
                    return;
                }
                window.location.href = '/todo/todo.html';
            }

            // altre azioni non protette
        });
    });

    // ---------------------------
    // Login / Logout
    // ---------------------------
    loginBtn?.addEventListener('click', () => {
        window.location.href = '/login/login.html';
    });

    logoutBtn?.addEventListener('click', async () => {
        try {
            await window.api.logoutUser();
        } catch (err) {
            console.error('Errore logout:', err);
        } finally {
            window.location.reload();
        }
    });

    // ---------------------------
    // Admin quick login
    // ---------------------------
    adminBtn?.addEventListener('click', async () => {
        const userName = "admin";
        const password = "admin";
        try {
            await window.api.loginUser(userName, password);
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 600);
        } catch (err) {
            console.error(err);
        } finally {
            loginBtn.disabled = false;
        }
    });

    // ---------------------------
    // Fetch silenziosa dei todo (genera notifiche)
    // ---------------------------
    async function fetchTodosSilently() {
        try {
            await window.api.fetchTodos();
        } catch (err) {
            console.error('Errore fetchTodos silenzioso:', err);
        }
    }

    // ---------------------------
    // Aggiornamento badge notifiche
    // ---------------------------
    async function updateNotificationBadge() {
        if (!notificationBadge) return;
        try {
            const count = await window.api.fetchNotificationsCount();
            notificationBadge.innerText = count ?? 0;
            notificationBadge.style.display = count > 0 ? 'inline-block' : 'none';
        } catch (err) {
            console.error('Errore badge notifiche:', err);
        }
    }

    // ---------------------------
    // Avvio iniziale
    // ---------------------------
    if (isLogged) {
        await fetchTodosSilently();  // crea notifiche lato server
        await updateNotificationBadge();  // aggiorna badge
    }

    // Aggiornamento badge ogni 60s
    setInterval(async () => {
        if (isLogged) await updateNotificationBadge();
    }, 60000);

});
