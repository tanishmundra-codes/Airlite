const Reviews = require("../Models/review");
const Listing = require("../Models/listing");

//Create Review
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let newreview = new Reviews(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "New Review created");
    res.redirect(`/listings/${listing._id}`);
}

//Destroy Review
module.exports.destroyreview = async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
 

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}