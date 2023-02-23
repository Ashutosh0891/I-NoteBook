const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "ashitjsjjj";
//Route 1:creating user using POST "/api/auth/createuser"
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('phoneNumber').isLength(10)
], async (req, res) => {
    let success=false;
    // if there are errors,return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // to check that if same emails exist or not
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success,error: "email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
      

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            phoneNumber: req.body.phoneNumber
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        console.log(authToken)
        success=true;
        res.json({success,authToken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }
})

//Route 2:user authentication using login credentials use only email and password using POST "/api/auth/login"
router.post('/login', [
    body('email', "enter a valid email").isEmail(),
    body('password', "password should not be empty").exists()
], async (req, res) => {
    
    // if there are errors,return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //bring email and password from created user
    const { email, password } = req.body;
    //find email from database and verify
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Please login with proper credentials' })
        }
        let success=false;
        //match the correct password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false;
            return res.status(400).json({ success,error: 'Please login with proper credentials' })
        }
        //match the payload with key 
        const payload = {
            user: {
                id: user.id
            }
        }
        //sign the authentication
        const authToken = jwt.sign(payload, JWT_SECRET);
        success=true;
        res.json({ success,authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }
})
//Route 3:getting userinfo by creating a middleware and decoding jwt token using POST "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id
        let user = await User.findById(userId).select("-password");
        res.send(user)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error occured');
    }
})
module.exports = router