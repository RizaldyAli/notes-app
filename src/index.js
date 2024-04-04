// Define custom elements
class AppBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <h1>Notes App</h1>
            </header>
        `;
    }
}

customElements.define('app-bar', AppBar);

class NoteItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const body = this.getAttribute('body');

        this.innerHTML = `
            <div class="note">
                <h2>${title}</h2>
                <p>${body}</p>
                <button class="delete-button">Delete</button>
            </div>
        `;
    }
}

customElements.define('note-item', NoteItem);

class NoteInput extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <form id="noteForm">
                <input type="text" id="noteTitle" placeholder="Title" required>
                <textarea id="noteBody" placeholder="Write your note here" required></textarea>
                <button type="submit">Add Note</button>
            </form>
        `;
    }
}

customElements.define('note-input', NoteInput);

// API endpoints
const apiUrl = 'https://notes-api.dicoding.dev/v2';
const notesUrl = `${apiUrl}/notes`;

// Function to create a new note
async function createNote(title, body) {
    try {
        const response = await fetch(notesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
}

// Function to get all notes
async function getNotes() {
    try {
        const response = await fetch(notesUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting notes:', error);
        throw error;
    }
}

// Function to delete a note
async function deleteNote(noteId) {
    try {
        const response = await fetch(`${notesUrl}/${noteId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}

// Function to render notes
async function renderNotes() {
    try {
        const notesData = await getNotes();
        const noteList = document.getElementById('noteList');
        noteList.innerHTML = '';
        notesData.data.forEach(note => {
            const noteElement = document.createElement('note-item');
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('body', note.body);
            noteElement.setAttribute('note-id', note.id);
            noteList.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error rendering notes:', error);
    }
}

// Event listener for form submission to create a new note
const noteForm = document.getElementById('noteForm');
noteForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;

    if (title.trim() === '' || body.trim() === '') {
        alert('Please fill in both title and body fields.');
        return;
    }

    try {
        await createNote(title, body);
        await renderNotes();
        noteForm.reset();
    } catch (error) {
        console.error('Error creating note:', error);
    }
});

// Event delegation for delete button clicks
const noteList = document.getElementById('noteList');
noteList.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-button')) {
        const noteId = event.target.closest('note-item').getAttribute('note-id');
        try {
            await deleteNote(noteId);
            await renderNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
});

// Initial rendering of notes when the page loads
window.onload = renderNotes;