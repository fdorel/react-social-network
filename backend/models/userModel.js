const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String }
});

// we want to export a variable or a file called 'User', which will be 'mongoose.model()'. This model will allow us to storeage and save users.
//It has to have a name for the collection to store this model in, like "user", and then the Schema in which the user will be inserted - userSchema
module.exports = User = mongoose.model("user", userSchema);