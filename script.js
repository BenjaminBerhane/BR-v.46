const newNoteForm = document.getElementById("newNoteForm");
const addNoteButton = document.getElementById("addNoteButton");
const clearAllButton = document.getElementById("clearAllButton");
const newNoteInput = document.getElementById("newNoteInput");
const noteDescription = document.getElementById("newNoteDescription");
const noteList = document.getElementById("activeNotes");
const noNotesMessage = document.getElementById("noNotesMessage");
const errorMessage = document.getElementById("errorMessage");


// Döljer Error Message
errorMessage.style.display = "none";

// Hämtar sparade anteckningar från localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem("notesAppData");  
    if (savedNotes) {
        try { //Felhantering ifall det finns ett fel i localStorage
            const notes = JSON.parse(savedNotes);
            notes.forEach((note) => createNoteDOM(note));
        } catch (error) {
            console.error("Error:", error);
        }
        notes.forEach((note) => createNoteDOM(note)); //för varje note skapas DOM-element
    }
    toggleNoNotesMessage(); // tar bort texten som säger att det inte finns notes i listan
}
 
// Sparar anteckningar till localStorage
function saveNotes(notes) {
    localStorage.setItem("notesAppData", JSON.stringify(notes));
}

// Hämtar alla anteckningar från DOM
function getNotesFromDOM() {
    return Array.from(noteList.children).map((noteItem) => ({
        id: noteItem.dataset.id,
        title: noteItem.querySelector(".note-title").textContent,
        description: noteItem.querySelector(".note-description"),
        timestamp: noteItem.dataset.timestamp,
    }));
}

// Visar eller döljer meddelandet "No Notes available"
function toggleNoNotesMessage() {
    noNotesMessage.style.display = noteList.children.length === 0 ? "block" : "none"; //kontrollerar om det finns anteckningar, om inte visas meddelandet
}

// Visar felmeddelande
function showError(message) {
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
    newNoteInput.style.borderColor = "red";
}

// Döljer felmeddelande
function hideError() {
    errorMessage.style.display = "none";
    newNoteInput.style.borderColor = "";
}

// Skapar och renderar en ny anteckning
function createNoteDOM(note) {
    const { id, title, description, timestamp } = note;

    const newNote = document.createElement("li");
    newNote.className = "note";
    newNote.dataset.id = id;
    newNote.dataset.timestamp = timestamp;

    // Lägg till titel
    const titleElement = document.createElement("span");
    titleElement.className = "note-title";
    titleElement.textContent = title;
    newNote.appendChild(titleElement);

    // Lägg till beskrivning (om den finns)
    if (description) {
        const descriptionElement = document.createElement("p");
        descriptionElement.className = "note-description";
        descriptionElement.textContent = description;
        newNote.appendChild(descriptionElement);
    }

    // Lägg till datum
    const timestampElement = document.createElement("p");
    timestampElement.className = "note-timestamp";
    const date = new Date(parseInt(timestamp));
    timestampElement.textContent = `Created: ${date.toLocaleString()}`;
    newNote.appendChild(timestampElement);

    // Lägg till knappar
    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "delete-button-wrapper";

    // Ta bort anteckning
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

// Lägger till en ny anteckning och renderar den
function addNewNote() {
    const title = newNoteInput.value.trim();
    const description = noteDescription.value.trim();

    if (!title) {
        showError("You must enter a note title");
        return;
    }
    // Döljer felmeddelandet igen efter att ett anteckning har blivit skapad
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

// Lägg till klickhändelse för att skapa ny anteckning
addNoteButton.addEventListener("click", (event) => {
    event.preventDefault();
    addNewNote();
});

// Skapa "Clear All"-knappen

// clearAllButton.id = "clearAllButton";
// clearAllButton.textContent = "Clear All";
// clearAllButton.style.display = "none"; // Döljer knappen initialt
// document.body.appendChild(clearAllButton); // Lägger till knappen i DOM

// Funktion för att hantera Clear All-knappen
clearAllButton.addEventListener("click", () => {
    localStorage.clear(); // Rensa localStorage
    while (noteList.firstChild) {
        noteList.removeChild(noteList.firstChild); // Rensa alla DOM-element
    }
    toggleNoNotesMessage(); 
    clearAllButton.style.display = "none"; // Döljer knappen efter den använts
});

// Uppdatera knappen beroende på om det finns anteckningar
function toggleClearAllButton() {
    clearAllButton.style.display = noteList.children.length > 0 ? "block" : "none";
}

// Uppdatera befintliga funktioner
function toggleNoNotesMessage() {
    noNotesMessage.style.display = noteList.children.length === 0 ? "block" : "none";
    toggleClearAllButton(); // Kontrollera Clear All-knappen
}

// Lägg till detta i `loadNotes` för att visa knappen om det finns sparade anteckningar
loadNotes();
toggleClearAllButton();


// Ladda anteckningar vid sidstart
loadNotes();
