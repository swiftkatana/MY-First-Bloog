
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName:String,
    password:String
    
});
userSchema.plugin(passportLocalMongoose);

userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

exports.User = User;