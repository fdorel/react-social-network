// we create a router which comes from express, and which will execute the 'Router()' function that will create a router force
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// the router will interact with different url in the backend. For example: 'server/users/register' is one route, and we can configure this route.
// the callback function with the 2 parameteres as Objects '(req, res)' is executed whenever this router is triggered. Whenever we make an HTTP Get request "/test" yo our server, executes the '(req,res)=>{}' function. 'req' is the HTTP resquest, 'res' is the response object that we use as a response
//Then we go to index.js and include this route as middleware :
// router.get("/test", (req, res) => {
//     res.send("It is working");
// });

// router.post("/register", async (req, res) => {
//     const {email, password, passwordCheck, displaName} = req.body;

//     // const Joi = require('joi');
//     const loginSchema = Joi.object().keys({
//       username: Joi.string()
//         .min(3),
//         .max(10),
//         .required(),
//       password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
//     });
    
//     app.post('/login', function(req, res) {
//       const valid = Joi.validate(req.body, loginSchema).error === null;
//       if (!valid) {
//         res.status(422).json({
//           status: 'error'
//           message: 'Invalid request data'
//           data: req.body
//         });
//       } else {
//         // happy days - login user
//         res.send(`ok`);
//       }
//     });
// });

router.post("/register", async (req, res) => {
    try {
   let {email, password, passwordCheck, displayName} = req.body;

    // validation
    if( !email || !password || !passwordCheck )
    //we stop the whole function, return, but first respond with a status 400 which means 'bad request' code  
    return res.status(400).json({ msg: "There are empty fields" });

    if( password.length < 5 )
    return res.status(400).json({ msg: "The password needs to be at least 5 characters long" });

    if( password !== passwordCheck )
    return res.status(400).json({ msg: "Enter the same password twice" });
   

    // the response will give us a Promise "await", so that we wait for MongoDB to find the user. If it found one, it will store the found user inside const "existingUser"; if it won't find any user, it will return null
    const existingUser = await User.findOne({email: email});   // second email is the one in the register, first one is from the form field
    if( existingUser ) 
        return res.status(400).json({ msg: "An account with this email already exists" }
    );
    
    //if the displayName is not entered, then the dashboard will display Welcome, email@email.com instead of username 
    if( !displayName ) displayName = email;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password: passwordHash,
        displayName 
    });
    const savedUser = await newUser.save();
    res.json(savedUser); 

    }
    catch (err) {
        res.status(500).json({ err: err.message });  
  }
});


router.post("/login", async (req, res) => {
    try {
   let {email, password, displayName} = req.body;

    // validation
    if( !email || !password )
        return res.status(400).json({ msg: "There are empty fields" });
        
    const user = await User.findOne({ email: email });
    if( !user ) 
        return res.status(400).json({ msg: "No account with this email was registered" }
    );

    // it returns a String as a first parameter, the second parameter will be a hashed String from the user
    const isMatch = await bcrypt.compare(password, user.password);
    if( !isMatch ) return res.status(400).json({ msg: "No password match!" });

    // sign the jsonwebtoken - little package of information that tells the frontend: "You are indeed logged in". 
    // jwt.sign will sign an Object (a payload) - from the user document (the above login user) we put in this "_id", which belongs to the unique user. this id is point to which user has logged in. We can use this jwt token later to retreive the id of the currently logged user. This jwt stores which user has loggedin and then require a password, a secret message that is going to encrypt (encode) in this jsonwebtoken, and we cannot verify jsonwebtoken if we don't have that password. Now we gonna use a .env variable "JWT_SECRET" in '.env' file.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
        token,
        user: {
            id: user._id,
            displayName: user.displayName 
        }
    });

    } catch (err) {
        res.status(500).json({ err: err.message });  
    }
});

// 'auth' is the second parameter, and it is imported from 'auth.js' as a middleware and goes into the function body.
router.delete("/delete", auth, async (req, res) => {
    try {
        // here mongoose will delete the user, so it returns 'the user has to be deleted from the database'
        const deletedUser = await User.findByIdAndDelete(req.user); // <-- this will be the deleted user from the database.
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ err: err.message });  
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if( !token ) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if( !verified ) return res.json(false);

        // we verify once again if the user is in the database
        const user = await User.findById(verified.id)
        if( !user ) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ err: err.message });  
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user._id
    });
});

module.exports = router;
