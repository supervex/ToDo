// api.js

// ---------------------------
// Helper fetch
// ---------------------------
async function getJSON(url, options = {}) {
    const res = await fetch(url, { credentials: 'same-origin', ...options });
    if (!res.ok) throw new Error(`${url} - ${res.status}`);
    return res.json();
}

// ---------------------------
// USER
// ---------------------------
async function fetchUser() {
    return getJSON('/api/user/me');
}

async function loginUser(userName, password) {
    const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ userName, password })
    });
    if (!res.ok) throw new Error(`/api/user/login - ${res.status}`);
    return res.json();
}

async function logoutUser() {
    const res = await fetch('/api/user/logout', { method: 'POST', credentials: 'same-origin' });
    if (!res.ok) throw new Error(`/api/user/logout - ${res.status}`);
    return res.json();
}

// ---------------------------
// TODOS
// ---------------------------
async function fetchTodos() {
    return getJSON('/api/todos');
}

async function createTodo(body) {
    const res = await fetch('/api/todos/createTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`/api/todos/createTodo - ${res.status}`);
    return res.json();
}

async function updateTodoStatus(id, status) {
    const res = await fetch('/api/todos/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id, status })
    });
    if (!res.ok) throw new Error(`/api/todos/update-status - ${res.status}`);
    return res.json();
}

async function getTodoById(id) {
    return getJSON(`/api/todos/${id}`);
}

async function deleteTodo(id) {
    const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin'
    });
    if (!res.ok) throw new Error(`/api/todos/${id} DELETE - ${res.status}`);
    return res.json();
}

async function updateTodo(body) {
    const res = await fetch('/api/todos/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`/api/todos/update - ${res.status}`);
    return res.json();
}

// ---------------------------
// Notifications API
// ---------------------------
async function fetchNotificationsCount() {
    return getJSON('/api/notifications/unread/count');
}

async function fetchNotifications() {
    return getJSON('/api/notifications/all');
}

async function markNotificationsAsRead(notificationIds) {
    if (!notificationIds || notificationIds.length === 0) return true;

    const res = await fetch('/api/notifications/read', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationIds)
    });

    if (!res.ok) throw new Error(`/api/notifications/read - ${res.status}`);
    return res.json();
}
// ---------------------------
// TODOS by status (lista)
// ---------------------------
async function fetchTodosByStatuses(statuses) {
    if (!statuses || statuses.length === 0) {
        throw new Error('Almeno uno status richiesto');
    }

    const query = statuses.map(s => `status=${encodeURIComponent(s)}`).join('&');
    return getJSON(`/api/todos/status?${query}`);
}
// ---------------------------
// Diary API
// ---------------------------


async function fetchDiaryByDate(date) {
    return getJSON(`/api/diary?date=${encodeURIComponent(date)}`);
}

function saveDiaryLocal(date, content) {
    if (!date) return;
    localStorage.setItem(`diario-contenuto-${date}`, content);
}

function loadDiaryLocal(date) {
    if (!date) return '';
    return localStorage.getItem(`diario-contenuto-${date}`) || '';
}

async function createDiaryEntry({ message, date }) {
    const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
            message,
            entryDate: date
        })
    });

    if (!res.ok) throw new Error(`/api/diary POST - ${res.status}`);
    return res.json();
}

async function updateDiaryEntry({ id, message }) {
    const res = await fetch(`/api/diary/${id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('updateDiaryEntry - ' + res.status);
    return res.json();
}

// ---------------------------
// Esporta tutte le funzioni globalmente
// ---------------------------

window.api = {
    fetchUser,
    loginUser,
    logoutUser,
    fetchTodosByStatuses,
    createTodo,
    updateTodoStatus,
    getTodoById,
    deleteTodo,
    updateTodo,
    fetchNotificationsCount,
    fetchNotifications,
    markNotificationsAsRead,
    fetchDiaryByDate,
    saveDiaryLocal,
    loadDiaryLocal,
    createDiaryEntry,
    updateDiaryEntry
};