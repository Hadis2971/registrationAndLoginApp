const express = require("express"),
      router  = express.Router();

function ensureauthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error_msg", "You Need First to Login");
        res.redirect(303, "/users/login");
    }
}

router.get("/", ensureauthenticated, (req, res) => {
    res.render("index");
});

module.exports = router;