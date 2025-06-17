const Listing = require("./Models/listing");

module.exports.isLoggedIn = (req, res, next) => {
      if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must logged in");
            return res.redirect("/login");
        }
    next();
};

module.exports.saveRedirectedUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You Don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}