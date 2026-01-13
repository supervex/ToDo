document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('topbar-container');
    if (!container) return;

    // Carica topbar
    const res = await fetch('/components/topbar.html');
    container.innerHTML = await res.text();

    // Titolo e sottotitolo
    const title = document.getElementById('topbarTitle');
    const subtitle = document.getElementById('topbarSubtitle');

    window.topbarSetTitle = (newTitle, newSubtitle) => {
        if (title && newTitle) title.innerText = newTitle;
        if (subtitle && newSubtitle) subtitle.innerText = newSubtitle;
    };

    document.dispatchEvent(new Event('topbar:ready'));
});

document.addEventListener('topbar:ready', async () => {
    // Elementi topbar
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');

    const notificationBtn = document.getElementById('notificationBtn');
    const notificationBadge = document.getElementById('notificationBadge');
    const popover = document.getElementById('popover');

    let isLogged = false;
    let username = null;
    let clickedNotifications = new Set(); // notifiche cliccate

    try {
        const data = await window.api.fetchUser();
        isLogged = !!data.logged;
        username = data.username ?? null;
    } catch {
        isLogged = false;
    }


    if (isLogged) {
        loginBtn?.classList.add('hidden');
        logoutBtn?.classList.remove('hidden');
        window.topbarSetTitle(`Benvenuto, ${username}`, 'La tua dashboard');
    } else {
        loginBtn?.classList.remove('hidden');
        logoutBtn?.classList.add('hidden');
        window.topbarSetTitle('Benvenuto', 'La tua dashboard');
    }

    // Event listener base
    loginBtn?.addEventListener('click', () => window.location.href = '/login/login.html');
    logoutBtn?.addEventListener('click', async () => {
        try { await window.api.logoutUser(); } finally { window.location.reload(); }
    });
    adminBtn?.addEventListener('click', async () => {
        try { await window.api.loginUser('dudins', 'admin'); window.location.reload(); }
        catch (err) { console.error('Errore login admin', err); }
    });

    // -------------------
    // LOGICA NOTIFICHE
    // -------------------
    async function updateBadge() {
        try {
            const count = await window.api.fetchNotificationsCount();
            notificationBadge.innerText = count;
            notificationBadge.classList.toggle('hidden', count === 0);
        } catch (err) {
            console.error('Errore badge notifiche', err);
        }
    }

    notificationBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (popover.style.display === 'block') {
            await closePopover();
        } else {
            await openPopover();
        }
    });

    async function openPopover() {
        try {
            const notifications = await window.api.fetchNotifications();
            clickedNotifications.clear();

            if (!notifications.length) {
                popover.innerHTML = '<div class="notif-empty">Nessuna notifica</div>';
            } else {
                popover.innerHTML = notifications.map(n => `
                <div class="notification-item" data-id="${n.id}">${n.message}</div>
            `).join('');

                popover.querySelectorAll('.notification-item').forEach(item => {
                    item.addEventListener('click', () => {
                        item.classList.toggle('clicked');
                        const id = Number(item.dataset.id);
                        if (clickedNotifications.has(id)) clickedNotifications.delete(id);
                        else clickedNotifications.add(id);
                    });
                });
            }

            // Mostra il popover
            popover.style.display = 'block';

            const rect = notificationBtn.getBoundingClientRect();
            popover.style.top = rect.bottom + window.scrollY + "px";
            popover.style.left = rect.right - popover.offsetWidth + "px";

        } catch (err) {
            console.error('Errore fetching notifiche', err);
        }
    }


    async function closePopover() {
        popover.style.display = 'none';
        if (clickedNotifications.size > 0) {
            try {
                await window.api.markNotificationsAsRead([...clickedNotifications]);
                clickedNotifications.clear();
                await updateBadge();
            } catch (err) {
                console.error('Errore marking notifications as read', err);
            }
        }
    }

    document.addEventListener('click', (e) => {
        if (popover.style.display === 'block' && !popover.contains(e.target) && e.target !== notificationBtn) {
            closePopover();
        }
    });

    if (isLogged) {
        await updateBadge();
        setInterval(updateBadge, 60000);
    }
});

