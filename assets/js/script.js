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
        this.notes = JSON.parse(localStorage.getItem('notes')) || []; // Initialise an empty array to store the notes
        this.selectedNoteId = "";
        this.miniSidebar = true;

        this.$activeForm = document.querySelector(".active-form");
        this.$inactiveForm = document.querySelector(".inactive-form");
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");
        this.$notes = document.querySelector(".notes");
        this.$form = document.querySelector("#form");
        this.$modal = document.querySelector(".modal");
        this.$modalForm = document.querySelector("#modal-form");
        this.$modalTitle = document.querySelector("#modal-title");
        this.$modalText = document.querySelector("#modal-text");
        this.$closeModalForm = document.querySelector("#modal-btn");
        this.$sidebar = document.querySelector(".sidebar");
        this.$sidebarActiveItem = document.querySelector(".active-item");
        this.$closeFormBtn = document.querySelector("#close-form-btn");
        
        this.addEventListeners();
        this.displayNotes();
    }

    addEventListeners() {
        // Add a click event listener to the body of the document
        document.body.addEventListener("click", (event) => {
            // When a click event occurs, callthe handleFormClick method
            this.handleFormClick(event);
            this.closeModal(event);
            this.openModal(event); 
            this.handleArchiving(event);
        });

        this.$form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevents the page / browser from refreshing
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.addNote({ title, text });
            this.closeActiveForm();
        });

        // Close active form on close button click
        this.$closeFormBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevents the page / browser from refreshing
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.addNote({ title, text });
            this.closeActiveForm();
        });

        this.$modalForm.addEventListener("submit", (event) => {
            event.preventDefault();
        });

        this.$sidebar.addEventListener("mouseover", (event) => {
            this.handleToggleSidebar();
        });
      
          this.$sidebar.addEventListener("mouseout", (event) => {
            this.handleToggleSidebar();
        });

        this.$modalTitle.addEventListener("focus", () => {
            this.$modalTitle.style.caretPosition = "start";
        });
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
            this.addNote({ title, text });
            // Calling the function to close the active form
            this.closeActiveForm();
        }
    }

    openActiveForm() {
        this.$inactiveForm.style.display = "none";
        this.$activeForm.style.display = "block";
        this.$noteText.focus();
    }

    closeActiveForm() {
        this.$inactiveForm.style.display = "block";
        this.$activeForm.style.display = "none";
        this.$noteText.value = "";
        this.$noteTitle.value = "";
    }

    openModal(event) {
        const $selectedNote = event.target.closest(".note");
        if ($selectedNote && !event.target.closest(".archive")) {
            this.selectedNoteId = $selectedNote.id;
            this.$modalTitle.value = $selectedNote.children[1].innerHTML;
            this.$modalText.value = $selectedNote.children[2].innerHTML;
            this.$modal.classList.add("open-modal");
        } else {
            return;
        }
    }

    closeModal(event) {
        const isModalFormClickedOn = this.$modalForm.contains(event.target);
        const isCloseModalBtnClickedOn = this.$closeModalForm.contains(event.target);
        if ((!isModalFormClickedOn || isCloseModalBtnClickedOn) && this.$modal.classList.contains("open-modal")) {
            this.editNote(this.selectedNoteId, {
              title: this.$modalTitle.value,
              text: this.$modalText.value,
            });
            this.$modal.classList.remove("open-modal");
        }
    }

    handleArchiving(event) {
        const $selectedNote = event.target.closest(".note");
        if ($selectedNote && event.target.closest(".archive")) {
          this.selectedNoteId = $selectedNote.id;
          this.deleteNote(this.selectedNoteId);
        } else {
            return;
        }
    }

    // Method to add a new note to the notes
     addNote({title, text}) {
        if (text !== "") {
            const newNote = new Note(cuid(), title, text) 
            this.notes = [...this.notes, newNote]; // Add the new note to the notes array

            this.render();
        };      
     };
    
    // Method to edit an existing note in the notes
    editNote(id, {title, text}) {
        this.notes = this.notes.map((note) => {
            if (note.id === id) {
                note.title = title;
                note.text = text;
            }
            return note;
        });
        this.render();
    }

    handleMouseOverNote(element) {
        const $note = document.querySelector("#" + element.id);
        const $checkNote = $note.querySelector(".check-circle");
        const $noteFooter = $note.querySelector(".note-footer");
        $checkNote.style.visibility = "visible";
        $noteFooter.style.visibility = "visible";
    }
    
    handleMouseOutNote(element) {
        const $note = document.querySelector("#" + element.id);
        const $checkNote = $note.querySelector(".check-circle");
        const $noteFooter = $note.querySelector(".note-footer");
        $checkNote.style.visibility = "hidden";
        $noteFooter.style.visibility = "hidden";
    }

    handleToggleSidebar() {
        if (this.miniSidebar) {
          this.$sidebar.style.width = "280px";
          this.$sidebar.classList.add("sidebar-hover");
          this.$sidebarActiveItem.classList.add("sidebar-active-item");
          this.miniSidebar = false;
        } else {
          this.$sidebar.style.width = "80px";
          this.$sidebar.classList.remove("sidebar-hover");
          this.$sidebarActiveItem.classList.remove("sidebar-active-item");
          this.miniSidebar = true;
        }
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    render() {
        this.saveNotes();
        this.displayNotes();
    }

    displayNotes() {
        this.$notes.innerHTML = this.notes.map((note) =>

            `
                <div class="note" id="${note.id}">
                    <div class="tooltip">
                        <span class="material-symbols-outlined check-circle"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBkPSJNMTIsMiBDMTcuNTIsMiAyMiw2LjQ4IDIyLDEyIEMyMiwxNy41MiAxNy41MiwyMiAxMiwyMiBDNi40OCwyMiAyLDE3LjUyIDIsMTIgQzIsNi40OCA2LjQ4LDIgMTIsMiBaIE0xMCwxNC4yIEw3LjQsMTEuNiBMNiwxMyBMMTAsMTcgTDE4LDkgTDE2LjYsNy42IEwxMCwxNC4yIFoiIGlkPSJwYXRoLTEiPjwvcGF0aD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJjaGVja19jaXJjbGVfMjRweCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBvbHlnb24gaWQ9ImJvdW5kcyIgcG9pbnRzPSIwIDAgMjQgMCAyNCAyNCAwIDI0Ij48L3BvbHlnb24+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgIDwvbWFzaz4KICAgICAgICA8dXNlIGlkPSJNYXNrIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgPC9nPgo8L3N2Zz4K"></span>
                        <span class="tooltip-text">Select note</span>
                    </div>
                    <div class="note-title">${note.title}</div>
                    <div class="note-text">${note.text}</div>
                    <div class="note-footer-icons">
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">
                                add_alert
                            </span>
                            <span class="tooltip-text">Remind me</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">
                                person_add
                            </span>
                            <span class="tooltip-text">Collaborator</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">
                                palette
                            </span>
                            <span class="tooltip-text">Background options</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">
                                image
                            </span>
                            <span class="tooltip-text">Add image</span>
                        </div>
                        <div class="tooltip archive">
                            <span class="material-symbols-outlined hover footer-icon">
                                archive
                            </span>
                            <span class="tooltip-text">Archive</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">
                                more_vert
                            </span>
                            <span class="tooltip-text">More</span>
                        </div>
                    </div>
                </div>
            `
        ).join(""); // Display each note's details
    }

    // Method to delete a note 
    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id !== id); // Remove the note from the array
        this.render();
    }
}

const app = new App();