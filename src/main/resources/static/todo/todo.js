document.addEventListener('topbar:ready', () => {
    if (typeof window.topbarSetTitle === 'function') {
        window.topbarSetTitle('Dashboard Todo', 'Gestisci le tue attività');
    }
});

document.addEventListener('DOMContentLoaded', async () => {

    console.log("todo.js caricato");
    const addTaskBtn = document.getElementById('addTaskBtn');
    const todoForm = document.querySelector('.todo-form');
    const title = document.getElementById('todoTitle');
    const descriptionInput = document.getElementById('todoDescription');
    const statusSelect = document.getElementById('todoStatus');
    const saveBtn = document.getElementById('saveTodo');
    const todoList = document.getElementById('todoList');
    const messageDiv = document.getElementById('message');

    // modal elementi
    const dateModal = document.getElementById('dateModal');
    const endDateInput = document.getElementById('endDate');
    const confirmBtn = document.getElementById('confirmDate');
    const cancelBtn = document.getElementById('cancelDate');

    // quick buttons and chips
    const quickButtons = document.querySelectorAll('.quick-btn');
    const chipsContainer = document.getElementById('chipsContainer');
    const clearChipsBtn = document.getElementById('clearChips');

    const doneList = document.getElementById('doneList');
    const doneCount = document.getElementById('doneCount');

    // priority buttons
    const priorityButtons = document.querySelectorAll('.priority-btn');

    function showForm(show = true) {
        if (!todoForm || !addTaskBtn) return;
        if (show) {
            todoForm.classList.remove('hidden');
            addTaskBtn.innerText = 'Chiudi';
            setTimeout(() => {
                const t = document.getElementById('todoTitle');
                if (t) { t.focus(); t.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            }, 100);
        } else {
            todoForm.classList.add('hidden');
            addTaskBtn.innerText = 'Aggiungi task';
            const t = document.getElementById('todoTitle');
            if (t) t.value = '';
            const d = document.getElementById('todoDescription');
            if (d) d.value = '';
            const s = document.getElementById('todoStatus');
            if (s) s.value = 'TODO';
        }
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const hidden = todoForm && todoForm.classList.contains('hidden');
            showForm(hidden);
        });
    }
    // sanity checks
    if (!dateModal || !saveBtn || !confirmBtn || !cancelBtn) {
        console.error('Elementi DOM mancanti, todo.js abortito');
        return;
    }

    dateModal.classList.add('hidden');

    let pendingTodo = null;

    let chips = [];
    let chipIdCounter = 1;

    let selectedPriority = 'MEDIUM';

    function formatDateAsYMD(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function recomputeDateFromChips() {
        const now = new Date();
        let months = 0;
        let days = 0;
        for (const c of chips) {
            if (c.type === 'day') days += 1;
            if (c.type === 'week') days += 7;
            if (c.type === 'month') months += 1;
        }

        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (months) d.setMonth(d.getMonth() + months);
        if (days) d.setDate(d.getDate() + days);
        endDateInput.value = formatDateAsYMD(d);
    }

    function renderChips() {
        chipsContainer.innerHTML = '';
        for (const c of chips) {
            const el = document.createElement('span');
            el.className = 'chip';
            const label = (c.type === 'day') ? '1 giorno' : (c.type === 'week') ? '1 settimana' : '1 mese';
            el.innerHTML = `<span class="chip-label">${label}</span><span class="remove" data-id="${c.id}">&times;</span>`;
            chipsContainer.appendChild(el);
        }
    }

    function addChip(type) {
        const chip = { id: chipIdCounter++, type };
        chips.push(chip);
        renderChips();
        recomputeDateFromChips();
    }

    function removeChipById(id) {
        chips = chips.filter(c => c.id !== id);
        renderChips();
        recomputeDateFromChips();
    }

    function clearAllChips() {
        chips = [];
        renderChips();
        endDateInput.value = '';
    }

    // priority UI helpers
    function setPriority(priority) {
        selectedPriority = priority;
        priorityButtons.forEach(btn => {
            if (btn.dataset.priority === priority) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    function setChipsFromDueDate(dueDateStr) {
        if (!dueDateStr) {
            clearAllChips();
            return;
        }
        const today = new Date();
        const target = new Date(dueDateStr);
        // normalize times
        const tmp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (target <= tmp) {
            clearAllChips();
            endDateInput.value = formatDateAsYMD(target);
            return;
        }

        // compute months
        let months = 0;
        let cursor = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
        while (true) {
            const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate());
            if (next <= target) {
                months++;
                cursor = next;
            } else break;
        }

        // remaining days
        const msPerDay = 24 * 3600 * 1000;
        const remDays = Math.round((target - cursor) / msPerDay);

        // convert remDays to weeks + days
        let weeks = Math.floor(remDays / 7);
        let days = remDays % 7;

        // build chips array accordingly
        chips = [];
        chipIdCounter = 1;
        for (let i = 0; i < months; i++) chips.push({ id: chipIdCounter++, type: 'month' });
        for (let i = 0; i < weeks; i++) chips.push({ id: chipIdCounter++, type: 'week' });
        for (let i = 0; i < days; i++) chips.push({ id: chipIdCounter++, type: 'day' });

        renderChips();
        recomputeDateFromChips();
    }

    chipsContainer.addEventListener('click', (e) => {
        const rm = e.target.closest('.remove');
        if (!rm) return;
        const id = Number(rm.dataset.id);
        if (!isNaN(id)) removeChipById(id);
    });

    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.add;
            addChip(type);
        });
    });

    clearChipsBtn?.addEventListener('click', () => {
        clearAllChips();
    });

    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const p = btn.dataset.priority; // LOW | MEDIUM | HIGH
            setPriority(p);
        });
    });

    saveBtn.addEventListener('click', () => {
        const text = title.value.trim();
        const status = statusSelect.value;

        if (!text) {
            messageDiv.innerText = "Inserisci un task";
            messageDiv.style.color = "red";
            return;
        }

        pendingTodo = {
            title: text,
            status: status,
            description: descriptionInput.value.trim()
        };

        clearAllChips();
        endDateInput.value = '';
        dateModal.classList.remove('hidden');
        saveBtn.disabled = true;
    });

    confirmBtn.addEventListener('click', async () => {

        const dueDate = endDateInput.value; // formato yyyy-mm-dd
        if (!dueDate) {
            alert("Inserisci la data di fine");
            return;
        }

        const body = {
            title: pendingTodo.title,
            description: pendingTodo.description,
            status: pendingTodo.status,
            dueDate: dueDate,
            priority: selectedPriority
        };

        try {
            const response = await window.api.createTodo(body);
            if (response.success) {
                messageDiv.innerText = response.message || 'Salvato';
                messageDiv.style.color = 'green';
                title.value = '';
                descriptionInput.value = '';
                // aggiorna UI
                await reloadTodosToUI();
            } else {
                messageDiv.innerText = response.message || 'Errore';
                messageDiv.style.color = 'red';
            }
        } catch (err) {
            console.error(err);
            messageDiv.innerText = 'Errore: ' + err.message;
            messageDiv.style.color = 'red';
        } finally {
            dateModal.classList.add('hidden');
            pendingTodo = null;
            saveBtn.disabled = false;
            clearAllChips();
        }
    });

    cancelBtn.addEventListener('click', () => {
        dateModal.classList.add('hidden');
        pendingTodo = null;
        saveBtn.disabled = false;
        clearAllChips();
    });

    endDateInput.addEventListener('input', () => {
        // optional: puoi sincronizzare chips live se vuoi
    });

    // helper per formato data
    function formatDateDMY(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d)) return escapeHtml(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // escape HTML
    function escapeHtml(s) {
        if (!s) return '';
        return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    }


    function addTodoToList(todo, container = todoList) {
        const row = document.createElement('div');
        row.className = 'todo-row';

        if (todo.expired) {
            row.classList.add('expired');
            row.title = 'Task scaduto';
        }
        const dueHtml = todo.dueDate
            ? `<span class="due-date">${escapeHtml(formatDateDMY(todo.dueDate))}</span>`
            : `<span class="due-date due-empty">—</span>`;

        // priority badge
        let badgeHtml = '';
        if (todo.priority) {
            const p = String(todo.priority).toUpperCase();
            const cls = (p === 'HIGH') ? 'high' : (p === 'MEDIUM') ? 'medium' : 'low';
            const label = (p === 'HIGH') ? 'Alta' : (p === 'MEDIUM') ? 'Media' : 'Bassa';
            badgeHtml = `<span class="priority-badge ${cls}">${label}</span>`;
        }

        const descHtml = todo.description ? `<div class="todo-desc">${escapeHtml(todo.description)}</div>` : '';

        const actionsHtml = `
          <div class="todo-actions">
            <button class="edit-btn" data-id="${todo.id}">Apri</button>
            <button class="delete-btn" data-id="${todo.id}">Elimina</button>
          </div>
        `;

        row.innerHTML = `
          <div class="todo-main">
            ${badgeHtml}
            <span class="todo-title">${escapeHtml(todo.title)}</span>
            ${descHtml}
          </div>

          <div class="todo-meta" style="display:flex; align-items:center; gap:12px;">
            ${dueHtml}
            <select class="status-select" data-id="${todo.id}">
               <option value="TODO" ${todo.status === 'TODO' ? 'selected' : ''}>TODO</option>
               <option value="IN_PROGRESS" ${todo.status === 'IN_PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
               <option value="DONE" ${todo.status === 'DONE' ? 'selected' : ''}>DONE</option>
            </select>
            ${actionsHtml}
          </div>
        `;
        container.appendChild(row);
    }

    // reload che carica due chiamate distinte (attivi e done)
    async function reloadTodosToUI() {
        try {
            // Attivi: TODO + IN_PROGRESS
            const activeTodos = await window.api.fetchTodosByStatuses(['TODO', 'IN_PROGRESS']);
            todoList.innerHTML = '';
            activeTodos.forEach(t => addTodoToList(t, todoList));

            // Done
            const doneTodos = await window.api.fetchTodosByStatuses(['DONE']);
            if (doneList) {
                doneList.innerHTML = '';
                doneTodos.forEach(t => addTodoToList(t, doneList));
            }
            if (doneCount) doneCount.innerText = String(doneTodos.length);
        } catch (err) {
            console.error(err);
            messageDiv.innerText = 'Errore caricamento todo';
            messageDiv.style.color = 'red';
        }
    }

    // delega globale per change (cattura anche le select dentro doneList)
    document.addEventListener('change', async (e) => {
        const select = e.target.closest('.status-select');
        if (!select) return;

        const todoId = select.dataset.id;
        const newStatus = select.value;

        try {
            await window.api.updateTodoStatus(todoId, newStatus);
            messageDiv.innerText = 'Stato aggiornato';
            messageDiv.style.color = 'green';
            await reloadTodosToUI();
        } catch (err) {
            console.error(err);
            messageDiv.innerText = 'Errore aggiornamento stato';
            messageDiv.style.color = 'red';
        }
    });

    // delega globale per click (edit, delete)
    document.addEventListener('click', async (e) => {
        const openBtn = e.target.closest('.edit-btn');
        if (openBtn) {
            const todoId = openBtn.dataset.id;
            window.location.href = `update/todoUpdate.html?id=${todoId}`;
            return;
        }

        const delBtn = e.target.closest('.delete-btn');
        if (delBtn) {
            if (!confirm('Vuoi eliminare questo task?')) return;
            const todoId = delBtn.dataset.id;
            try {
                await window.api.deleteTodo(todoId);
                messageDiv.innerText = 'Eliminato con successo';
                messageDiv.style.color = 'green';
                await reloadTodosToUI();
            } catch (err) {
                console.error(err);
                messageDiv.innerText = 'Errore delete';
                messageDiv.style.color = 'red';
            }
            return;
        }
    });

    // avvio
    await reloadTodosToUI();
    window.topbarSetTitle('Dashboard Todo', 'Gestisci le tue attività');
});
