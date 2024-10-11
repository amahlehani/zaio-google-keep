// Create a note
class Note {
    constructor(id, title, text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

// Define the App class
class App {
    constructor() {
        this.notes = []; // Initialise an empty array to store the notes
        this.$activeForm = document.querySelector(".active-form");
        this.$inactiveForm = document.querySelector(".inactive-form");
        this.$noteTitle = document.querySelector(".note-title");
        this.$noteText = document.querySelector(".note-text");
        this.$notes = document.querySelector(".notes");
        this.$form = document.querySelector("#modal-form");
        this.$modal = document.querySelector(".modal");

        this.addEventListeners();
        this.displayNotes();
    }

    addEventListeners() {
        // Add a click event listener to the body of the document
        document.body.addEventListener("click", (event) => {
            // When a click event occurs, callthe handleFormClick method
            this.handleFormClick(event);
            this.openModal(event); 
        })

        this.$form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevents the page / browser from refreshing
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.addNote({title, text});
            this.closeActiveForm();
        })
    }

    handleFormClick(event) {
        const isActiveFormClickedOn = this.$activeForm.contains(event.target);
        const isInactiveFormClickedOn = this.$inactiveForm.contains(event.target);

        const title = this.$noteTitle.value;
        const text = this.$noteText.value;

        if (isInactiveFormClickedOn) {
            //  Calling the function to open the active form
            this.openActiveForm();
        }else if(!isInactiveFormClickedOn && !isActiveFormClickedOn) {
            // Calling the function to add the new note
            this.addNote({title, text});
            // Calling the function to close the active form
            this.closeActiveForm();
        }
    };

    openModal(event) {
        if (event.target.closes(".note")) {
            this.$modal.classList.add("open-model");
        };
    };

    openActiveForm() {
        this.$activeForm.style.display = "block";
        this.$inactiveForm.style.display = "none";
        this.$noteText.focus();
    };

    closeActiveForm() {
        this.$activeForm.style.display = "none";
        this.$inactiveForm.style.display = "block";
    }

    // Method to add a new note to the notes
     addNote({title, text}) {
        if (text != "") {
            const newNote = new Note(cuid(), title, text) 
            this.notes = [...this.notes, newNote]; // Add the new note to the notes array

            this.displayNotes();
        };      
     };
    
    // Method to edit an existing note in the notes
    editNote(id, {title, text}) {
        this.notes = this.notes.map(note => {
            if (note.id === id) {
                note.title = title;
                note.text = text;
            }
            return note;
        });
    }

    //Method to delete a note 
    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id); // Remove the note from the array
    }

    displayNotes() {
        this.$notes.innerHTML = this.notes.map((note) =>

            `
                <div class="note" id="${note.id}">
                    <div class="note-header">
                        <p>${note.title}</p>
                        <div class="tooltip">
                            <span class="material-symbols-outlined note-pin">keep</span>
                            <span class="tooltip-text">Pin note</span>
                        </div>
                    </div>
                    <p class="note-text-area">${note.text}</p>
                    <div class="note-footer-icons">
                        <div class="tooltip">
                            <span class="material-symbols-outlined footer-icon">
                                add_alert
                            </span>
                            <span class="tooltip-text">Remind me</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined footer-icon">
                                person_add
                            </span>
                            <span class="tooltip-text">Collaborator</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined footer-icon">
                                palette
                            </span>
                            <span class="tooltip-text">Background options</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined footer-icon">
                                image
                            </span>
                            <span class="tooltip-text">Add image</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined footer-icon">
                                archive
                            </span>
                            <span class="tooltip-text">Archive</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined footer-icon">
                                more_vert
                            </span>
                            <span class="tooltip-text">More</span>
                        </div>
                    </div>
                </div>
            `
        ).join(" "); // Display each note's details
    }
}

const app = new App();