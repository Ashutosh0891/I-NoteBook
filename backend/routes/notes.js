const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const router = express.Router();
const { body, validationResult } = require('express-validator');
//Route 1:get all notes using GET "/api/notes/fetchallnotes" login required (Read)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        
        const notes = await Note.find({ user:req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }

})

//Route 2:add new notes using POST "/api/notes/addnotes" login required (Create)
router.post('/addnotes', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 5 }),
    body('description', "Enter a valid description ").isLength({ min: 5 }),
    body('tag').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // if there are errors,return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }
})

//Route 3:update existing notes using PUT "/api/notes/updatenotes/:id" login required (Update)
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create new note object
    try {
        const newNote = {}
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }
        //find note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('not found')
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('not allowed')
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }

})

//Route 4:delete existing notes using DELETE "/api/notes/deletenotes/:id" login required (Delete)
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {

    //find note to be deleted and delete it\
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('not found')
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('not allowed')
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }

})
module.exports = router
