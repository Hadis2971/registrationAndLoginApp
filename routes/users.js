const express = require("express"),
      router  = express.Router(),
      User = require("../models/user"),
      passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy;

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/register", (req, res) => {
    let name = req.body.name,
        username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        password2 = req.body.password2;

    req.checkBody("name", "The Name Field is Mandatory").notEmpty();
    req.checkBody("username", "The Username Field is Mandatory").notEmpty();
    req.checkBody("email", "The Email Field is Mandatory").notEmpty();
    req.checkBody("email", "Please Enter a Valid Email Address").isEmail();
    req.checkBody("password", "The Password Field is Required").notEmpty();
    req.checkBody("password2", "The Passwords Must Match").equals(password);
    
    let errors = req.validationErrors();

    if(errors){
        res.render("register", {
            errors: errors
        });
    }else{
       User.findOne({username: {"$regex": "^" + username + "\\b", "$options": "i"}},
        function(err, user){
            User.findOne({email: {"$regex": "^" + email + "\\b", "$options": "i"}},
        function(err, mail){
            if(user || mail){
                res.render("register", {
                    user: user,
                    mail: mail
                });
            }else{
                let newUser = new User({
                    name: name,
                    username: username,
                    email: email,
                    password: password
                });

                User.createUser(newUser, (err, user) => {
                    if(err) throw err;
                    else console.log(user);
                });

                req.flash("success_msg", "You Are Now Registred And Can Now Login");
                res.redirect(303, "/users/login");
            }
        })
        })
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, {message: 'Incorrect Username.'});
        }
      User.comparePasswords(password, user.password, (err, isMatch) => {
          if(err) throw err;
          else{
              if(isMatch){
                  return done(null, user);
              }else{
                  return done(null, false, {message: 'Incorrect Password.'});
              }
          }
      });  
      });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You Have Successfully Logged out");
    res.redirect(303, "/users/login");
});

module.exports = router;