import React, { Component } from "react";
import "../../App.css";
import NotefulContext from "../../NotefulContext";
import ValidationError from "../ValidationErrors/ValidationError";
class AddNoteForm extends Component {
  static contextType = NotefulContext;
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      folderId: "",
      modified: "",
      name: "",
      nameValid: false,
      contentValid: false,
      folderValid: false,

      formValid: null,
      validationMessages: {
        name: "",
        folder: "",
        content: ""
      }
    };
  }
  noteNameChanged(name) {
    this.setState(
      {name},
      () => {
        this.validateNoteName(name);
      } //need to add the validate note name
    );
  }
  noteContentChanged(content) {
    this.setState(
      {
        content
      },
      () => {
        this.validateContent(content);
      } //need to add the validate note content
    );
  }
  folderIdChanged(folderId) {
    console.log(`folderId is`,folderId);
    this.setState(
      {
        folderId
      },
      () => this.validateFolder(folderId)
    );
  }
  validateNoteName(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.name = "Note name is required";
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.name = "Note name must be at least 3 characters";
        hasError = true;
      } else {
        fieldErrors.name = "";
        hasError = false;
      }
    }
    this.setState(
      {
        validationMessages: fieldErrors,
        noteValid: !hasError
      },
      this.formValid
    );
  }
  validateContent(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    fieldValue=fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.content = "Content is required";
      hasError = true;
    } else {
      if (fieldValue.length < 10) {
        fieldErrors.content = "Note name must be at least 10 characters";
        hasError = true;
      } else {
        fieldErrors.content = "";
        hasError = false;
      }
    }
    this.setState(
      {
        validationMessages: fieldErrors,
        contentValid: !hasError
      },
      this.formValid
    );
  }
  validateFolder(fieldValue) {
    const fieldErrors = { ...this.state.validationMessages };
    let hasError = false;
    if (fieldValue === "") {
      fieldErrors.folder = "Folder is required";
      hasError = true;
    }
    this.setState(
      {
        validationMessages: fieldErrors,
        folderValid: !hasError
      },
      this.formValid
    );
  }
  formValid() {
    this.setState({
      formValid:
        this.state.noteValid &&
        this.state.contentValid &&
        this.state.folderValid
    });
  }
  handleNoteSubmit(e) {
    e.preventDefault();
    console.log(`this clicked`);
    const newNote = {
      content: this.state.content,
      folder_id: this.state.folderId,
      note_name: this.state.name,
      modified: new Date().toISOString()
    };
    
    console.log(
      `this is what the JSON springify does`,
      JSON.stringify(newNote)
    );
    const url = "http://localhost:8000/api/notes";
    const options = {
      method: "POST",
      body: JSON.stringify(newNote),
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error("Something went wrong, please try again later");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          error: null,
          content: "",
          folder_id: "",
          note_name: ""
        });
        this.context.addNote(data);
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  }
  render() {
    const errorMessage = this.state.error ? <h3>Please retry</h3> : null;
    let folders = this.context.folders.map(folder => {
      return (
        <option key={folder.id} value={folder.id}>
          {folder.folder_name}
        </option>
      );
    });
    return (
      <form onSubmit={e => this.handleNoteSubmit(e)}>
        <div className="AddNoteForm">
          <h3>Create a Note</h3>
          {errorMessage}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="noteName"
            aria-label="Name of new note"
            onChange={e => this.noteNameChanged(e.target.value)}
          />
          <ValidationError
            hasError={!this.state.noteValid}
            message={this.state.validationMessages.name}
          />
          <br />
          <label htmlFor="content">Content:</label>
          <textarea
            type="text"
            id="content"
            name="noteContent"
            aria-label="Content of new note"
            onChange={e => this.noteContentChanged(e.target.value)}
          />
          <ValidationError
            hasError={!this.state.contentValid}
            message={this.state.validationMessages.content}
          />
          <br />
          <label htmlFor="folders">Folders:</label>
          <select
            className="folder-select"
            id="folder"
            name="folder-dropdown"
            aria-label="dropdown menu of folders"
            onChange={e => this.folderIdChanged(e.target.value)}
          >
            <option value="" disabled selected>
              Choose a Folder
            </option>
            {folders}
          </select>
          <ValidationError
            hasError={!this.state.folderValid}
            message={this.state.validationMessages.folders}
          />
        </div>
        <button
          type="submit"
          disabled={!this.state.formValid}
          className="addNoteButton"
        >
          Add Note
        </button>
      </form>
    );
  }
}
export default AddNoteForm;
