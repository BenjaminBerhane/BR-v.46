const newNoteForm = document.getElementById("newNoteForm");
const addNoteButton = document.getElementById("addNoteButton");
const clearAllButton = document.getElementById("clearAllButton");
const newNoteInput = document.getElementById("newNoteInput");
const noteDescription = document.getElementById("newNoteDescription");
const noteList = document.getElementById("activeNotes");
const noNotesMessage = document.getElementById("noNotesMessage");
const errorMessage = document.getElementById("errorMessage");


// Hides the Error Message
errorMessage.style.display = "none";

// Retrieves saved notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem("notesAppData");  
    if (savedNotes) {
        try { // Error handling in case there is an issue with localStorage
            const notes = JSON.parse(savedNotes);
            notes.forEach((note) => createNoteDOM(note));  // Creates DOM elements for each note
        } catch (error) {
            console.error("Error:", error);
        }
    }
    toggleNoNotesMessage(); // Removes the message saying there are no notes in the list
}
 
// Saves notes to localStorage
function saveNotes(notes) {
    localStorage.setItem("notesAppData", JSON.stringify(notes));
}

// Retrieves all notes from the DOM
function getNotesFromDOM() {
    return Array.from(noteList.children).map((noteItem) => ({
        id: noteItem.dataset.id,
        title: noteItem.querySelector(".note-title").textContent,
        description: noteItem.querySelector(".note-description"),
        timestamp: noteItem.dataset.timestamp,
    }));
}

// Displays or hides the "No Notes available" message
function toggleNoNotesMessage() {
    noNotesMessage.style.display = noteList.children.length === 0 ? "block" : "none"; // Checks if there are notes; if not, shows the message
}

// Displays the error message
function showError(message) {
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
    newNoteInput.style.borderColor = "red";
}

// Hides the error message
function hideError() {
    errorMessage.style.display = "none";
    newNoteInput.style.borderColor = "";
}

// Creates and renders a new note
function createNoteDOM(note) {
    const { id, title, description, timestamp } = note;

    const newNote = document.createElement("li");
    newNote.className = "note";
    newNote.dataset.id = id;
    newNote.dataset.timestamp = timestamp;

   // Add title
    const titleElement = document.createElement("span");
    titleElement.className = "note-title";
    titleElement.textContent = title;
    newNote.appendChild(titleElement);

     // Add description (if it exists)
    if (description) {
        const descriptionElement = document.createElement("p");
        descriptionElement.className = "note-description";
        descriptionElement.textContent = description;
        newNote.appendChild(descriptionElement);
    }

    // Add date
    const timestampElement = document.createElement("p");
    timestampElement.className = "note-timestamp";
    const date = new Date(parseInt(timestamp));
    timestampElement.textContent = `Created: ${date.toLocaleString()}`;
    newNote.appendChild(timestampElement);

     // Add buttons
    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "delete-button-wrapper";

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.innerText = "Delete";
    removeButton.addEventListener("click", () => {
        newNote.remove();
        toggleNoNotesMessage();
        saveNotes(getNotesFromDOM());
    });
    buttonWrapper.appendChild(removeButton);

    newNote.appendChild(buttonWrapper);

    noteList.appendChild(newNote);
}

// Creates and appends a new note
function addNewNote() {
    const title = newNoteInput.value.trim();
    const description = noteDescription.value.trim();

    if (!title) {
        showError("You must enter a note title");
        return;
    }
    // Hides the error message again after a note is created
    hideError();

    const newNote = {
        id: Date.now(),
        title,
        description,
        timestamp: Date.now(),
    };

    createNoteDOM(newNote);
    saveNotes(getNotesFromDOM());

    newNoteInput.value = "";
    noteDescription.value = "";
    toggleNoNotesMessage();
}

// Adds click event to create a new note
addNoteButton.addEventListener("click", (event) => {
    event.preventDefault();
    addNewNote();
});

// Function to handle the Clear All button
clearAllButton.addEventListener("click", () => {
    localStorage.clear(); 
    while (noteList.firstChild) {
        noteList.removeChild(noteList.firstChild); //Removes all DOM elements
    }
    toggleNoNotesMessage(); 
    clearAllButton.style.display = "none"; // Hides the button after it's used
});

// Updates the button based on whether there are notes
function toggleClearAllButton() {
    clearAllButton.style.display = noteList.children.length > 0 ? "block" : "none";
}

// Update existing functions
function toggleNoNotesMessage() {
    noNotesMessage.style.display = noteList.children.length === 0 ? "block" : "none";
    toggleClearAllButton(); //make sure the button is updated
}

// Ladda anteckningar vid sidstart
loadNotes();
