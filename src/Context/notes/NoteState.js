import React,{useState} from 'react'
import NoteContext from './noteContext'

const NoteState=(props)=>{
  const host="http://localhost:5000";
    const notesInitial=[]
    const [notes,setnotes]=useState(notesInitial);

    //Fetch all notes

    const getNote=async()=>{
      //api call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')
        },
      
      });
      const json= await response.json();
      setnotes(json)
     
    }

   //Add a note
   
    const addNote=async (title,description,tag)=>{
      //api call
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')

          
        },
        body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
      });
      
     
      
      const note=await response.json();
      setnotes(notes.concat(note))
    }

    //Delete a note

    const deleteNote=async(id)=>{
      //api call
      const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')

          
        },
       
      });
      const json= response.json(); // parses JSON response into native JavaScript objects

      const newNotes=notes.filter((note)=>{return note._id!==id});
      setnotes(newNotes)
    }
    //Update a note

    const editNote=async (id,title,description,tag)=>{
      //api call
      const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')

          
        },
        body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
      });
      const json= response.json(); // parses JSON response into native JavaScript objects
   

      let newNotes=JSON.parse(JSON.stringify(notes))
      for (let index = 0; index < notes.length; index++) {
        const element = notes[index];
        if(element._id===id){
          newNotes[index].title=title;
          newNotes[index].description=description;
          newNotes[index].tag=tag;
          break;
        }
        
      }
      setnotes(newNotes)
    }
    return(
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;