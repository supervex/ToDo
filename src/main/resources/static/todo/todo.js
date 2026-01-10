document.addEventListener('DOMContentLoaded', async () => {

    console.log("todo.js caricato");

    const title = document.getElementById('todoTitle');
    const statusSelect = document.getElementById('todoStatus');
    const saveBtn = document.getElementById('saveTodo');
    const todoList = document.getElementById('todoList');
    const messageDiv = document.getElementById('message');

    const dateModal = document.getElementById('dateModal');
    const endDateInput = document.getElementById('endDate');
    const confirmBtn = document.getElementById('confirmDate');
    const cancelBtn = document.getElementById('cancelDate');

    // quick buttons and chips
    const quickButtons = document.querySelectorAll('.quick-btn');
    const chipsContainer = document.getElementById('chipsContainer');
    const clearChipsBtn = document.getElementById('clearChips');

    if (!dateModal || !saveBtn || !confirmBtn || !cancelBtn) {
        console.error('Elementi DOM mancanti, todo.js abortito');
        return;
    }

    dateModal.classList.add('hidden');

    let pendingTodo = null;


    let chips = [];
    let chipIdCounter = 1;


    function formatDateAsYMD(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function recomputeDateFromChips() {
        const now = new Date();
        // count months and days
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

    saveBtn.addEventListener('click', () => {
        const text = title.value.trim();
        const status = statusSelect.value;

        if (!text) {
            messageDiv.innerText = "Inserisci un task";
            messageDiv.style.color = "red";
            return;
        }

        pendingTodo = { title: text, status: status };
        clearAllChips();
        endDateInput.value = '';
        dateModal.classList.remove('hidden');
        saveBtn.disabled = true;
    });

    confirmBtn.addEventListener('click', () => {

        const dueDate = endDateInput.value; // formato yyyy-mm-dd
        if (!dueDate) {
            alert("Inserisci la data di fine");
            return;
        }

        const body = {
            ...pendingTodo,
            dueDate: dueDate
        };

        fetch('/api/todos/createTodo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) throw new Error('Server response ' + res.status);
                return res.json();
            })
            .then(response => {
                if (response.success) {
                    messageDiv.innerText = response.message || 'Salvato';
                    messageDiv.style.color = 'green';
                    title.value = '';
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
        pendingTodo = null;
        saveBtn.disabled = false;
        clearAllChips();
    });

    endDateInput.addEventListener('input', () => {
    });

    function fetchTodos() {
        fetch('/api/todos')
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

    function addTodoToList(todo) {
        const row = document.createElement('div');
        row.className = 'todo-row';

        const due = todo.dueDate ? ` - ${todo.dueDate}` : '';
        row.innerHTML = `
      <span class="todo-title">${escapeHtml(todo.title)}${due}</span>
      <span class="status">${escapeHtml(todo.status ?? '')}</span>
    `;
        todoList.appendChild(row);
    }

    function escapeHtml(s) {
        if (!s) return '';
        return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    }

    // avvio
    fetchTodos();

});
