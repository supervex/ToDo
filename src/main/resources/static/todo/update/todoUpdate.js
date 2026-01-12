document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const todoId = params.get('id');

    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusSelect = document.getElementById('status');
    const messageDiv = document.getElementById('message');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (!todoId) {
        messageDiv.innerText = 'ID todo mancante';
        messageDiv.style.color = 'red';
        return;
    }

    fetch(`/api/todos/${todoId}`, {
        credentials: 'same-origin'
    })
        .then(res => {
            if (!res.ok) throw new Error('Todo non trovato');
            return res.json();
        })
        .then(todo => {
            titleInput.value = todo.title;
            descriptionInput.value = todo.description || '';
            statusSelect.value = todo.status;
        })
        .catch(err => {
            messageDiv.innerText = err.message;
            messageDiv.style.color = 'red';
        });

    saveBtn.addEventListener('click', () => {

        const body = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            status: statusSelect.value,
            id: todoId
        };

        if (!body.title) {
            messageDiv.innerText = 'Il titolo è obbligatorio';
            messageDiv.style.color = 'red';
            return;
        }

        fetch(`/api/todos/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) throw new Error('Errore salvataggio');
                return res.json();
            })
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

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/todo/todo.html';
    });

});
