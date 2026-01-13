document.addEventListener('DOMContentLoaded', () => {

    // Riferimenti agli elementi
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const messageDiv = document.getElementById('message');

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const regUsername = document.getElementById('regUsername');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    const showMessage = (text = '', color = '') => {
        messageDiv.innerText = text;
        messageDiv.style.color = color;
    };

    // ---------------------------
    // Controllo sessione
    // ---------------------------
    async function checkSession() {
        try {
            const data = await window.api.fetchUser();
            if (data.logged) {
                window.location.href = '/index.html';
                return true;
            }
        } catch (err) {
            console.warn('Errore controllo sessione:', err);
        }
        return false;
    }

    checkSession();

    // ---------------------------
    // SWITCH FORM
    // ---------------------------
    document.getElementById('showRegister')?.addEventListener('click', e => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        formTitle.innerText = 'Registrazione';
        showMessage();
    });

    document.getElementById('showLogin')?.addEventListener('click', e => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        formTitle.innerText = 'Login';
        showMessage();
    });

    // ---------------------------
    // LOGIN
    // ---------------------------
    loginBtn?.addEventListener('click', async () => {
        const userName = loginUsername.value.trim();
        const password = loginPassword.value;

        if (!userName || !password) return showMessage('Compila tutti i campi', 'red');

        loginBtn.disabled = true;
        showMessage('Sto effettuando il login...', 'black');

        try {
            const data = await window.api.loginUser(userName, password);  // già JSON

            if (!data.success) throw new Error(data.message || 'Errore durante il login');

            showMessage(data.message || 'Login effettuato', 'blue');
            setTimeout(() => window.location.href = '/index.html', 600);
        } catch (err) {
            showMessage(err.message || 'Errore di rete', 'red');
        } finally {
            loginBtn.disabled = false;
        }
    });


    // ---------------------------
    // REGISTRAZIONE
    // ---------------------------
    registerBtn?.addEventListener('click', async () => {
        const userName = regUsername.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value;

        if (!userName || !email || !password) return showMessage('Compila tutti i campi', 'red');

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

            if (!res.ok || !data.success) throw new Error(data?.message || 'Errore durante la registrazione');

            showMessage(data.message || 'Registrazione completata', 'blue');

            setTimeout(() => {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                formTitle.innerText = 'Login';
                showMessage();
            }, 1200);
        } catch (err) {
            showMessage(err.message || 'Errore di rete', 'red');
        } finally {
            registerBtn.disabled = false;
        }
    });

});
