document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;

            if (action === 'todo') {
                window.location.href = 'todo/todo.html';
            }
        });
    });
});
document.getElementById('loginBtn')
    ?.addEventListener('click', () => {
        window.location.href = '/login/login.html';
    });