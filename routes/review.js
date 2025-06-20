const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =  require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const {listingschema, reviewschema } = require("../schema.js");

const validateReview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);   
    } else {
    next();
    }
};

// <--review route-->
router.post("/", validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Reviews(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "New Review created");
    res.redirect(`/listings/${listing._id}`);
}));
//Delete Review Route 
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
})
);
module.exports = router;