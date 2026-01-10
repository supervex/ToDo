document.addEventListener('DOMContentLoaded', async () => {

    // riferimenti agli elementi (meglio usare const invece dei global ID)
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const message = document.getElementById('message');

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const regUsername = document.getElementById('regUsername');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    const showMessage = (text, color) => {
        message.innerText = text || '';
        message.style.color = color || '';
    };

    // 0) Controllo sessione: se già loggato rimando alla dashboard
    try {
        const res = await fetch('/api/user/me', {
            credentials: 'same-origin' // importante per ricevere/mandare cookie di sessione
        });

        if (res.ok) {
            const data = await res.json();
            if (data.logged) {
                // già loggato -> niente login page
                window.location.href = '/index.html';
                return;
            }
        }
        // se non-ok continuiamo normalmente (utente non loggato)
    } catch (err) {
        // network error: non blocchiamo la pagina, ma logghiamo
        console.warn('Impossibile controllare la sessione:', err);
    }

    // SWITCH FORM
    document.getElementById('showRegister').addEventListener('click', e => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        formTitle.innerText = 'Registrazione';
        showMessage('', '');
    });

    document.getElementById('showLogin').addEventListener('click', e => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        formTitle.innerText = 'Login';
        showMessage('', '');
    });

    // LOGIN
    loginBtn.addEventListener('click', async () => {
        const userName = loginUsername.value.trim();
        const password = loginPassword.value;

        if (!userName || !password) {
            showMessage('Compila tutti i campi', 'red');
            return;
        }

        // prevenzione doppio click
        loginBtn.disabled = true;
        showMessage('Sto effettuando il login...', 'black');

        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin', // fondamentale per gestire JSESSIONID
                body: JSON.stringify({ userName, password })
            });

            // proviamo a leggere il corpo: il server potrebbe restituire messaggio anche per errori
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                // preferiamo il messaggio dal body, altrimenti lo statusText
                const errMsg = data?.message || res.statusText || 'Errore durante il login';
                throw new Error(errMsg);
            }

            showMessage(data.message || 'Login effettuato', 'blue');

            // redirect dopo una breve pausa per mostrare il messaggio
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 600);

        } catch (err) {
            showMessage(err.message || 'Errore di rete', 'red');
        } finally {
            loginBtn.disabled = false;
        }
    });

    // REGISTRAZIONE
    registerBtn.addEventListener('click', async () => {
        const userName = regUsername.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value;

        if (!userName || !email || !password) {
            showMessage('Compila tutti i campi', 'red');
            return;
        }

        registerBtn.disabled = true;
        showMessage('Invio registrazione...', 'black');

        try {
            const res = await fetch('/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ userName, email, password })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                const errMsg = data?.message || res.statusText || 'Errore durante la registrazione';
                throw new Error(errMsg);
            }

            showMessage(data.message || 'Registrazione completata', 'blue');

            setTimeout(() => {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                formTitle.innerText = 'Login';
            }, 1200);

        } catch (err) {
            showMessage(err.message || 'Errore di rete', 'red');
        } finally {
            registerBtn.disabled = false;
        }
    });

});
