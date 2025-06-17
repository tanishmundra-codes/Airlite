const express = require("express");
const router = express.Router();
const User =  require("../Models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectedUrl} = require("../middleware.js");

//signup

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username , email, password} = req.body;
        const newUser = new User ({email, username});
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, ((err) => {
            if(err) {
            return next(err);
            }
            req.flash("success", "You are signup out");
            res.redirect("/listings");
    }));
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
}));

//login

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login", 
    saveRedirectedUrl,
    passport.authenticate("local" ,
        {failureRedirect : "/login", 
        failureFlash: true,
    }), async (req, res) => {
        req.flash("success","Welcome back to Airlite!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
)

//logout

router.get("/logout", (req,res,next) =>{
    req.logout((err) => {
        if(err) {
        return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
})

module.exports = router;