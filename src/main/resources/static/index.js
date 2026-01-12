document.addEventListener('DOMContentLoaded', async () => {

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const title = document.querySelector('.topbar h1');
    const adminBtn = document.getElementById('adminBtn');

    let isLogged = false;
    let userId = null;
    let username = null;

    // Controlla sessione
    try {
        const res = await fetch('/api/user/me', {
            credentials: 'same-origin'
        });

        if (!res.ok) {
            isLogged = false;
        } else {
            const data = await res.json();
            isLogged = !!data.logged;
            userId = data.userId ?? null;
            username = data.username ?? null;
        }
    } catch (err) {
        console.error('Errore controllo sessione:', err);
        isLogged = false;
    }

    if (isLogged) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        title.innerText = `BENVENUTO, ${username}`;
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        title.innerText = `BENVENUTO`;
    }

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            const action = card.dataset.action;

            if (action === 'todo') {
                if (!isLogged) {

                    window.location.href = '/login/login.html';
                    return;
                }
                window.location.href = 'todo/todo.html';
                return;
            }

            // altre azioni non protette
        });
    });

    loginBtn?.addEventListener('click', () => {
        window.location.href = '/login/login.html';
    });

    logoutBtn?.addEventListener('click', async () => {
        try {
            await fetch('/api/user/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });
        } catch (err) {
            console.error('Errore logout:', err);
        } finally {
            window.location.reload();
        }
    });

    adminBtn?.addEventListener('click', () => {
        const userName = "admin"
        const password = "admin"

        try {
            const res =  fetch('/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify({ userName, password })
            });
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 600);

        } catch (err) {
        } finally {
            loginBtn.disabled = false;
        }
    });
});
