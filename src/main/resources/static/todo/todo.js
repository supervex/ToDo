document.addEventListener('DOMContentLoaded', async () => {

    console.log("todo.js caricato");

    // elementi form
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

    // priority buttons
    const priorityButtons = document.querySelectorAll('.priority-btn');

    // sanity checks
    if (!dateModal || !saveBtn || !confirmBtn || !cancelBtn) {
        console.error('Elementi DOM mancanti, todo.js abortito');
        return;
    }

    dateModal.classList.add('hidden');

    // pendingTodo structure:
    // { id?: number, title, description, status, dueDate?, priority? }
    let pendingTodo = null;

    // chips state
    let chips = [];
    let chipIdCounter = 1;

    // priority state (LOW | MEDIUM | HIGH)
    let selectedPriority = 'MEDIUM';

    // helper: format Date -> yyyy-mm-dd
    function formatDateAsYMD(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    // recompute date from chips
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

    // render chips visual
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

    // if you want to compute chips from an existing dueDate (used on edit)
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

    // wire up chip removal (event delegation)
    chipsContainer.addEventListener('click', (e) => {
        const rm = e.target.closest('.remove');
        if (!rm) return;
        const id = Number(rm.dataset.id);
        if (!isNaN(id)) removeChipById(id);
    });

    // quick buttons
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.add;
            addChip(type);
        });
    });

    clearChipsBtn?.addEventListener('click', () => {
        clearAllChips();
    });

    // priority button clicks
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const p = btn.dataset.priority; // LOW | MEDIUM | HIGH
            setPriority(p);
        });
    });

    // OPEN modal for create: pendingTodo without id
    saveBtn.addEventListener('click', () => {
        const text = title.value.trim();
        const status = statusSelect.value;

        if (!text) {
            messageDiv.innerText = "Inserisci un task";
            messageDiv.style.color = "red";
            return;
        }

        pendingTodo = {
            // no id => create mode
            title: text,
            status: status,
            description: descriptionInput.value.trim()
        };

        // reset modal state
        clearAllChips();
        endDateInput.value = '';
        setPriority('MEDIUM');

        dateModal.classList.remove('hidden');
        saveBtn.disabled = true;
    });

    // OPEN modal for edit (prefill). We'll expose a function to call when Edit button clicked.
    function openEditModal(todo) {
        // todo has id, title, description, status, dueDate, priority
        pendingTodo = {
            id: todo.id,
            title: todo.title,
            status: todo.status,
            description: todo.description || ''
        };

        // prefill form fields (main)
        title.value = todo.title || '';
        descriptionInput.value = todo.description || '';
        statusSelect.value = todo.status || 'TODO';

        // priority
        setPriority(todo.priority || 'MEDIUM');

        // compute chips from dueDate and show date in input
        setChipsFromDueDate(todo.dueDate);

        dateModal.classList.remove('hidden');
        saveBtn.disabled = true;
    }

    // CONFIRM modal (create or update)
    confirmBtn.addEventListener('click', () => {

        const dueDate = endDateInput.value; // formato yyyy-mm-dd
        if (!dueDate) {
            alert("Inserisci la data di fine");
            return;
        }

        if (!pendingTodo) {
            messageDiv.innerText = 'Nessun task da salvare';
            messageDiv.style.color = 'red';
            dateModal.classList.add('hidden');
            saveBtn.disabled = false;
            return;
        }

        // merge pendingTodo with dueDate + priority
        const payload = {
            ...pendingTodo,
            dueDate: dueDate,
            priority: selectedPriority
        };

        let endpoint;
        let method = 'POST';

        if (pendingTodo.id) {
            // update mode: use your existing update endpoint
            endpoint = '/api/todos/update';
        } else {
            // create mode
            endpoint = '/api/todos/createTodo';
        }

        fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error('Server response ' + res.status);
                return res.json();
            })
            .then(response => {
                if (response.success) {
                    messageDiv.innerText = response.message || (pendingTodo.id ? 'Aggiornato' : 'Salvato');
                    messageDiv.style.color = 'green';
                    // pulisci form solo in create mode (in edit we keep form cleared too)
                    title.value = '';
                    descriptionInput.value = '';
                    fetchTodos();
                } else {
                    messageDiv.innerText = response.message || 'Errore';
                    messageDiv.style.color = 'red';
                }
            })
            .catch(err => {
                console.error(err);
                messageDiv.innerText = 'Errore: ' + err.message;
                messageDiv.style.color = 'red';
            })
            .finally(() => {
                dateModal.classList.add('hidden');
                pendingTodo = null;
                saveBtn.disabled = false;
                clearAllChips();
            });
    });

    cancelBtn.addEventListener('click', () => {
        dateModal.classList.add('hidden');
        // reset pending todo if it was create mode; if editing keep the main fields cleared earlier
        pendingTodo = null;
        saveBtn.disabled = false;
        clearAllChips();
    });

    // se l'utente modifica manualmente la data, non cancelliamo i chip per non sorprendere;
    // se preferisci cancellarli, decommenta:
    // endDateInput.addEventListener('input', () => clearAllChips());

    // fetch / render todos (mostro anche la priorità e la descrizione)
    function fetchTodos() {
        fetch('/api/todos', { credentials: 'same-origin' })
            .then(res => {
                if (!res.ok) throw new Error('GET /api/todos ' + res.status);
                return res.json();
            })
            .then(todos => {
                todoList.innerHTML = '';
                todos.forEach(addTodoToList);
            })
            .catch(err => {
                console.error(err);
            });
    }

    // add action buttons (Edit / Delete) to each row
    function addTodoToList(todo) {
        const row = document.createElement('div');
        row.className = 'todo-row';

        const due = todo.dueDate ? ` - ${todo.dueDate}` : '';

        // priority badge mapping
        let badgeHtml = '';
        if (todo.priority) {
            const p = String(todo.priority).toUpperCase();
            const cls = (p === 'HIGH') ? 'high' : (p === 'MEDIUM') ? 'medium' : 'low';
            const label = (p === 'HIGH') ? 'Alta' : (p === 'MEDIUM') ? 'Media' : 'Bassa';
            badgeHtml = `<span class="priority-badge ${cls}">${label}</span>`;
        }

        const descHtml = todo.description ? `<div class="todo-desc">${escapeHtml(todo.description)}</div>` : '';

        // action buttons
        const actionsHtml = `
          <div class="todo-actions">
            <button class="edit-btn" data-id="${todo.id}">Modifica</button>
            <button class="delete-btn" data-id="${todo.id}">Elimina</button>
          </div>
        `;

        row.innerHTML = `
          <div>
            ${badgeHtml}
            <span class="todo-title">${escapeHtml(todo.title)}${due}</span>
            ${descHtml}
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span class="status">${escapeHtml(todo.status ?? '')}</span>
            ${actionsHtml}
          </div>
        `;
        todoList.appendChild(row);
    }

    // event delegation for edit/delete (single listener)
    todoList.addEventListener('click', (e) => {
        const edit = e.target.closest('.edit-btn');
        if (edit) {
            const id = edit.dataset.id;
            // fetch todo details (could also use data from the list if included)
            fetch(`/api/todos/${id}`, { credentials: 'same-origin' })
                .then(res => {
                    if (!res.ok) throw new Error('GET todo ' + res.status);
                    return res.json();
                })
                .then(todo => {
                    openEditModal(todo);
                })
                .catch(err => {
                    console.error(err);
                    alert('Impossibile aprire il task per modifica');
                });
            return;
        }

        const del = e.target.closest('.delete-btn');
        if (del) {
            const id = del.dataset.id;
            if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

            fetch(`/api/todos/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            })
                .then(res => {
                    if (!res.ok) throw new Error('DELETE ' + res.status);
                    return res.json().catch(() => ({ success: true }));
                })
                .then(resp => {
                    // se backend ritorna JSON {success: true}
                    fetchTodos();
                    messageDiv.innerText = 'Task eliminato';
                    messageDiv.style.color = 'green';
                })
                .catch(err => {
                    console.error(err);
                    messageDiv.innerText = 'Errore eliminazione';
                    messageDiv.style.color = 'red';
                });
            return;
        }
    });

    function escapeHtml(s) {
        if (!s) return '';
        return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    }

    // avvio
    fetchTodos();

});
