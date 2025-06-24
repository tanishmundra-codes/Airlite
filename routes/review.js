const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =  require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController =  require("../controller/reviews.js");


//Review route
router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyreview));

module.exports = router;