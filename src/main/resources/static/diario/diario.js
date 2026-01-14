const book = document.querySelector('.book');
const diaryPage = document.querySelector('.diary-page');
const STORAGE_KEY = 'diario-contenuto';

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

function loadDiary() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) diaryPage.innerHTML = saved;
}

function saveDiary() {
    localStorage.setItem(STORAGE_KEY, diaryPage.innerHTML);
}

loadDiary();

diaryPage.addEventListener('click', (e) => e.stopPropagation());

book.addEventListener('click', () => {
    const isOpen = book.classList.toggle('open');

    if (isOpen) {
        setTimeout(() => {
            if (!diaryPage.innerText.trim()) {
                const today = new Date();
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const header = `<strong>Diario di oggi:</strong><br>${today.toLocaleDateString('it-IT', options)}<br><br>`;
                diaryPage.innerHTML = header;
            }
            placeCaretAtEnd(diaryPage);
        }, 600); // aspetta apertura libro
    } else {
        saveDiary();
        diaryPage.blur();
    }
});

diaryPage.addEventListener('input', () => saveDiary());
diaryPage.addEventListener('blur', () => saveDiary());
