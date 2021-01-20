const express = require("express");
//connect to mongoose
const mongoose = require("mongoose");
const cors = require("cors");
// to make our own variables environment, we store it in a variable
require("dotenv").config();

// set up express in a function - "app" - with which we can interact
const app = express();
// set up middleware "use()" - runs whenever we try to interact with any route in express. for example /login, /register
app.use(express.json());  //json - json body parser, so that we can read json objects from the request that we send to express, because we gonna use javascript to send our data
app.use(cors()); // we activate cross origin share reading

// environment variables we can get from the node "process"
const PORT = process.env.PORT || 5000;

// start the server, the second parameter is a callback function - listener
app.listen(5000, () => console.log(`The server has started on port: ${PORT}`));

// set up mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
    },
    (err) => {
        if(err) throw err;
        console.log("MongoDB connection established");
    }
);

// set up routes : use() is the middleware. Whenever we make any request on the backend that has been passed through the port 5000 or the hosting port, or on the localhost:5000/users, and this middleware starts with '/users', then it will run only this route below. If it is any other route, for example '/posts', '/items', it not gonna use this route.  When we start up with '/users', then we enable the file 'userRouter.js' --. router.get -->
app.use("/users", require("./routes/userRouter"));
app.use("/todos", require("./routes/todoRouter"));

