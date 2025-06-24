const User = require("../Models/user");

//RenderSignup
module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};
//SignUP
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You are signup out");
            res.redirect("/listings");
        }));
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};


//RenderLogin
module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}
//Login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Airlite!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
};