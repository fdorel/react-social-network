const jwt = require("jsonwebtoken");

// First thing to do is we need to get the token out of the headers.
const auth = async (req, res, next) => {
    try {    
    const token = req.header("x-auth-token");

    if( !token ) 
    // this return won't ever execute 'next' parameter.
    // if there is no token given ,we can't even verify it, we just say "you are not allowed" as said in the json message.
    return res.status(401).json({ msg: "No authentication token, authorization denied" });

    // it verifies 2 things: Synchronously verifies given token using a secret or a public key to get a decoded token Options for the verification returns - The decoded token.
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if( !verified )
    return res.status(401).json({ msg: "Token verification failed, authorization denied" });

    req.user = verified.id;
    next(); // after that we can go to delete from file 'userRouter.js'
    } catch (err) {
        res.status(500).json({ err: err.message });      
    }
}

module.exports = auth;