document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const todoId = params.get('id');

    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusSelect = document.getElementById('status');
    const messageDiv = document.getElementById('message');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const dueDateInput = document.getElementById('dueDate');
    const startDate = document.getElementById('startDate');
    let selectedPriority = 'MEDIUM';
    const priorityButtons = document.querySelectorAll('.priority-btn');

    if (!todoId) {
        if (messageDiv) {
            messageDiv.innerText = 'ID todo mancante';
            messageDiv.style.color = 'red';
        }
        return;
    }

    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPriority = btn.dataset.value;
            setActivePriority(selectedPriority);
        });
    });

    function setActivePriority(value) {
        priorityButtons.forEach(b => {
            b.classList.toggle('active', b.dataset.value === value);
        });
    }

    window.api.getTodoById(todoId)
        .then(todo => {
            if (!titleInput) return;
            titleInput.value = todo.title || '';
            descriptionInput.value = todo.description || '';
            statusSelect.value = todo.status;
            dueDateInput.value = todo.dueDate || '';
            startDate.value = toDateInputValue(todo.createdAt);
            selectedPriority = todo.priority || 'MEDIUM';
            setActivePriority(selectedPriority);
        })
        .catch(err => {
            if (messageDiv) {
                messageDiv.innerText = err.message;
                messageDiv.style.color = 'red';
            }
        });

    saveBtn?.addEventListener('click', () => {

        const body = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            status: statusSelect.value,
            id: todoId,
            dueDate: dueDateInput.value || null,
            priority: selectedPriority
        };

        if (!body.title) {
            messageDiv.innerText = 'Il titolo è obbligatorio';
            messageDiv.style.color = 'red';
            return;
        }

        window.api.updateTodo(body)
            .then(() => {
                messageDiv.innerText = 'Todo aggiornato';
                messageDiv.style.color = 'green';

                setTimeout(() => {
                    window.location.href = '/todo/todo.html';
                }, 800);
            })
            .catch(err => {
                messageDiv.innerText = err.message;
                messageDiv.style.color = 'red';
            });
    });

    cancelBtn?.addEventListener('click', () => {
        window.location.href = '/todo/todo.html';
    });

    function toDateInputValue(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    }
});