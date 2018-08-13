const mongoose = require("mongoose"),
      bcrypt   = require("bcryptjs");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    name: String,
    email: String,
    password: String
});      


const User = module.exports = mongoose.model("User", userSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username};
    User.findOne(username, callback);
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.comparePasswords = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        else{
            callback(null, isMatch);
        }
    });
}
