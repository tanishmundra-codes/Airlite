const express = require("express");
const router = express.Router();
const wrapAsync =  require("../utils/wrapAsync.js");
const { listingSchema, reviewschema } = require("../schema.js");
const ExpressError =  require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);   
    } else {
    next();
    }
};

//index route
    router.get("/", wrapAsync (async (req,res)=>{
        const alllisting = await Listing.find({}); 
        res.render("listings/index.ejs",{alllisting});    
         })
    );
//new route
    router.get("/new", isLoggedIn , (req,res)=>{
      
        res.render("listings/newlisting.ejs");
    });
//show route
  router.get("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}));

//route to create a new listing then add among other listings 
//create route
    router.post("/",  
        isLoggedIn,
        validateListing,
        wrapAsync (async(req,res)=>{
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
        })
    );
//edit route
    router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
})
    );
//update route 
    router.put("/:id",
        isLoggedIn,
        isOwner,
        validateListing, wrapAsync(async(req,res)=>{
        let {id} =  req.params;
    
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success", "listing updated");
        res.redirect(`/listings/${id}`);
        })
    );
//delete route
    router.delete("/:id",
        isLoggedIn,
        isOwner,
        wrapAsync(async(req,res)=>{
        let {id} =  req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "listing deleted");
        res.redirect("/listings");

        })
    );
   module.exports = router; 