// Import packages
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

// Setup express app
const app = express();

// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.log("Database connection failed:", err);
        process.exit(1); // Stop server if DB connection fails
    }
}

main();

// Setup ejs and views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

// Basic API request (root)
app.get("/", (req, res) => {
    res.send("Hi, I am the root route");
});

// Listings routes
app.get("/listings", WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.get("/listings/:id", WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

app.post("/listings", WrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

app.delete("/listings/:id", WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews

app.post("/listings/:id/reviews", async(req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   res.send("Review Saved");
});

app.get(/(.*)/, (req, res, next) => {
    console.log(req.path, req.params);
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.render("/error.ejs");
});


// Start the server
app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
