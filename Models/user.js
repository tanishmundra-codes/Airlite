const  mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email: {
        type: String,
        required : true
    },
});

// this will automatically creates a username and password schema with salting and hashing technique
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);