import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../Context/notes/noteContext';
import AddNotes from './AddNotes';
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';
const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getNote,editNote } = context;
  let navigate = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token')){
      navigate("/")
      getNote()
    }else{
      navigate("/login")
      
    }
  
   
  }, []);

  
  const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""});
  
  const updateNote = (currentNote) => {
    ref.current.click()
    setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag})
  }
  const ref = useRef(null);
  const refClose = useRef(null);

  const handleOnChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})
}
const handleOnClick=(e)=>{
    e.preventDefault();
    editNote(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click()
    props.showAlert("Updated Successfully","success")
    
}

  return (
    <>
      <AddNotes showAlert={props.showAlert}  />

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>


      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" value={note.etitle} name='etitle' aria-describedby="emailHelp" onChange={handleOnChange} minLength={5} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="desc" className="form-control" id="edescription" value={note.edescription} name='edescription' onChange={handleOnChange} minLength={5} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="tag" className="form-control" id="etag" name='etag' value={note.etag} onChange={handleOnChange} minLength={1} required />
                </div>

              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5 || note.etag<1} type="button" className="btn btn-primary" onClick={handleOnClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
                <h2>You Notes</h2>
                <div className="container mx-2"> 
                {notes.length===0 && 'No notes to display'}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} />
                })}
            </div>
    </>
  )
}

export default Notes
