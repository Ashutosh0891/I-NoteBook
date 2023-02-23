import React, { useContext, useState } from 'react'
import noteContext from '../Context/notes/noteContext';

const AddNotes = (props) => {
    const context=useContext(noteContext);
    const {addNote}=context;
    const [note,setNote]=useState({title:"",description:"",tag:""});

    const handleOnChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }

    const handleOnClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""})
        props.showAlert("Added Successfully","success")
    }

    return (
        <div>
            <div className="container">
                <h2>Add your note</h2>
                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" value={note.title} name='title' aria-describedby="emailHelp" onChange={handleOnChange} minLength={5} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="desc" className="form-control" id="description" value={note.description} name='description' onChange={handleOnChange} minLength={5} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="tag" className="form-control" id="tag" value={note.tag} name='tag' onChange={handleOnChange}  minLength={1} required />
                    </div>
                    <button disabled={note.title.length<5 || note.description.length<5 || note.tag<1} type="submit" className="btn btn-primary" onClick={handleOnClick}>AddNote</button>
                </form>

            </div>
        </div>
    )
}

export default AddNotes
