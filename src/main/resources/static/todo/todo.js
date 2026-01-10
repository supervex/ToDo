document.addEventListener('DOMContentLoaded', () => {

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

    if (!dateModal || !saveBtn || !confirmBtn || !cancelBtn) {
        console.error('Elementi DOM mancanti, todo.js abortito');
        return;
    }

    dateModal.classList.add('hidden');

    let pendingTodo = null;

    saveBtn.addEventListener('click', () => {
        const text = title.value.trim();
        const status = statusSelect.value;

        if (!text) {
            messageDiv.innerText = "Inserisci un task";
            messageDiv.style.color = "red";
            return;
        }

        pendingTodo = { title: text, status: status };
        endDateInput.value = '';     // pulisco il campo data
        dateModal.classList.remove('hidden');
        saveBtn.disabled = true;     // evita più aperture
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
                // controlla codice di stato
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
            });
    });

    cancelBtn.addEventListener('click', () => {
        dateModal.classList.add('hidden');
        pendingTodo = null;
        saveBtn.disabled = false;
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

    // aggiunge riga todo (mostra anche la dueDate se presente)
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
