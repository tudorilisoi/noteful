import React, { Component } from "react";
import { Link } from 'react-router-dom';
import '../../App.css';
import NotefulContext from '../../NotefulContext';
import PropTypes from 'prop-types'


function deleteNoteRequest(noteId, cb) {
  fetch(`http://localhost:8000/api/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    }
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
          throw error
        })
      }
      cb(noteId)
    })
    
    .catch(error => {
      console.log(error)
    })
}


class NoteList extends Component {
static propTypes={
notes: PropTypes.array.isRequired,
}
  static contextType = NotefulContext
  render() {
    console.log(`these were the props sent to notelist`, this.props)
    const { notes } = this.props
    notes.sort((a, b) => a.modified - b.modified)
    let notesHTML = this.props.notes.map((note, i) => {
      return (

        <div className='noteDetails' role='main'key={i}>
          <Link to={`/note/${note.id}`}>
            <h2>{note.note_name}</h2>
          </Link>
          <div className='noteButtons'>
          <button className='noteDeleteButton'onClick={() => {
            console.log(`this was clicked`, note.id)
            deleteNoteRequest(
              note.id,
              this.context.deleteNote)
          }
          }> Delete</button>
          <Link to={`/edit/note/${note.id}`}>
            <button className="editNoteButton">Edit Note</button>
                        </Link>
                        </div>
          <p>Modified on:{note.modified}</p>
          
        </div>

      )

    })
    return (
      <div className="NoteList">
        {notesHTML}
      </div>
    );
  }
}
export default NoteList;
