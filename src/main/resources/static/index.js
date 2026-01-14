document.addEventListener('topbar:ready', () => {

    const panelGrid = document.querySelector('.panel-grid');
    if (panelGrid) panelGrid.style.visibility = 'visible';


    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (action === 'todo') {
                window.location.href = '/todo/todo.html';
            }
            if (action === 'diario') {
                window.location.href = '/diario/diario.html';
            }
            // puoi aggiungere altre azioni per altre card
        });
    });
});
