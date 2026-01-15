
const book = document.querySelector('.book');
const diaryPage = document.querySelector('.diary-page');

const prevBtn = document.getElementById('prev-day');
const nextBtn = document.getElementById('next-day');
const dateDisplay = document.getElementById('date-display');
const entriesContainer = document.getElementById('entries-container');
const editor = document.getElementById('editor');

let selectedDate = new Date();

function isoDateLocal(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateItalian(d) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('it-IT', options);
}

async function setDate(d) {
    selectedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    dateDisplay.textContent = formatDateItalian(selectedDate);
    await fetchEntriesForDate(isoDateLocal(selectedDate));
    loadEditorLocal();
}

async function fetchEntriesForDate(dateStr) {
    entriesContainer.innerHTML = `<div class="entry">Caricamento...</div>`;
    try {
        const list = await api.fetchDiaryByDate(dateStr);
        console.log('Risposta API diary', list);
        renderEntries(list || []);
    } catch (err) {
        console.error('Errore fetch diary:', err);
        entriesContainer.innerHTML = `<div class="entry">Errore durante il caricamento: ${err.message}</div>`;
    }
}

function renderEntries(list) {
    if (!Array.isArray(list) || list.length === 0) {
        entriesContainer.innerHTML = `<div class="entry">Nessuna nota per questo giorno.</div>`;
        return;
    }
    entriesContainer.innerHTML = '';

    list.forEach(item => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';

        const timeText = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
            : '';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'entry-time';
        timeSpan.textContent = timeText;
        timeSpan.setAttribute('aria-hidden', 'true');

        const contentSpan = document.createElement('span');
        contentSpan.className = 'entry-text';
        contentSpan.textContent = item.message || '';
        contentSpan.dataset.id = item.id != null ? String(item.id) : ''; // utile per update

        const isManual = item.type === 'manual';

        contentSpan.contentEditable = isManual ? 'true' : 'false';
        if (!isManual) {
            contentSpan.setAttribute('tabindex', '-1');
            contentSpan.setAttribute('aria-readonly', 'true');
        } else {

            contentSpan.setAttribute('role', 'textbox');
        }

        entryDiv.appendChild(timeSpan);
        entryDiv.appendChild(contentSpan);
        entriesContainer.appendChild(entryDiv);

        if (isManual) {

            let original = (item.message || '').replace(/\s+/g, ' ').trim();

            contentSpan.addEventListener('blur', async (ev) => {

                const newContent = contentSpan.textContent.replace(/\s+/g, ' ').trim();

                if (newContent === original) return;

                const id = contentSpan.dataset.id;
                if (!id) {
                    console.error('Aggiornamento nota: manca id della nota, non posso aggiornare.');
                    contentSpan.textContent = original;
                    return;
                }

                try {
                    if (typeof api.updateDiaryEntry === 'function') {
                        await api.updateDiaryEntry({ id: Number(id), message: newContent });
                        original = newContent;
                        console.log('Nota aggiornata (id=' + id + '):', newContent);

                        api.saveDiaryLocal(isoDateLocal(selectedDate), '');
                    } else {
                        console.error('api.updateDiaryEntry non definita. Implementa questo endpoint lato api.js/backend.');

                        contentSpan.textContent = original;
                    }
                } catch (err) {
                    console.error('Errore aggiornamento nota manuale:', err);

                    contentSpan.textContent = original;
                }
            });

            contentSpan.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    contentSpan.blur();
                }
            });
        }
    });
}


function loadEditorLocal() {
    const s = api.loadDiaryLocal(isoDateLocal(selectedDate));
    editor.innerHTML = s || '';
    placeCaretAtEnd(editor);
}

function saveEditorLocal() {
    api.saveDiaryLocal(isoDateLocal(selectedDate), editor.innerHTML);
}

function placeCaretAtEnd(el) {
    el.focus();
    if (window.getSelection && document.createRange) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setDate(d);
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setDate(d);
});

book.addEventListener('click', async () => {
    const isOpen = book.classList.toggle('open');

    if (isOpen) {
        setTimeout(() => loadDiaryOnOpen(), 600);
    } else {
        let content = editor.textContent || '';
        content = content.replace(/\s+/g, ' ').trim();

        if (content.length > 0) {
            try {
                console.log('DEBUG: invio nota ->', { date: isoDateLocal(selectedDate), message: content });

                await api.createDiaryEntry({
                    date: isoDateLocal(selectedDate),
                    message: content,
                    type: 'manual'
                });
                console.log('Nuova nota salvata:', content);

                api.saveDiaryLocal(isoDateLocal(selectedDate), '');
            } catch (err) {
                console.error('Errore salvataggio nuova nota:', err);
            }
        }

        editor.innerHTML = '';
        editor.blur();

        await fetchEntriesForDate(isoDateLocal(selectedDate));
    }
});

function loadDiaryOnOpen() {
    if (!selectedDate) setDate(new Date());
    loadEditorLocal();
    placeCaretAtEnd(editor);
}

editor.addEventListener('input', () => {

});

document.addEventListener('DOMContentLoaded', () => {
    setDate(new Date());
});
