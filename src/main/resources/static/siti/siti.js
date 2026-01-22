document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    if (grid) grid.style.visibility = 'visible';

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            if (action === 'carSharing') {
                window.location.href = 'http://localhost:8081/carSharingV2_war_exploded/';
            }
        });
    });

});
