const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

//signup
router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

//login
router
    .route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectedUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userController.login);

//logout
router
    .route("/logout")
    .get(userController.logout);

module.exports = router;