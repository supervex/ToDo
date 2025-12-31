document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const message = document.getElementById('message');

    const showMessage = (text, color) => {
        message.innerText = text;
        message.style.color = color;
    };

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
    document.getElementById('loginBtn').addEventListener('click', async () => {
        const userName = loginUsername.value;
        const password = loginPassword.value;

        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userName, password })
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message);
            }

            showMessage(data.message, 'blue');

            setTimeout(() => {
                window.location.href = '/index.html';
            }, 600);

        } catch (err) {
            showMessage(err.message, 'red');
        }
    });

    // REGISTRAZIONE
    document.getElementById('registerBtn').addEventListener('click', async () => {
        const userName = regUsername.value;
        const email = regEmail.value;
        const password = regPassword.value;

        try {
            const res = await fetch('/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, email, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message);
            }

            showMessage(data.message, 'blue');

            setTimeout(() => {
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                formTitle.innerText = 'Login';
            }, 1200);

        } catch (err) {
            showMessage(err.message, 'red');
        }
    });
});
