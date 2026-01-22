document.addEventListener('topbar:ready', () => {

    const panelGrid = document.querySelector('.panel-grid');
    if (panelGrid) panelGrid.style.visibility = 'visible';

    window.api.fetchTodosByStatuses(['TODO', 'IN_PROGRESS']);

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (action === 'todo') {
                window.location.href = '/todo/todo.html';
            }
            if (action === 'diario') {
                window.location.href = '/diario/diario.html';
            }
            if (action === 'giochi') {
                window.location.href = '/giochi/giochi.html';
            }
            if (action === 'siti') {
                window.location.href = '/siti/siti.html';
            }
        });
    });
});
