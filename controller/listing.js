const Listing = require("../Models/listing");
const fetch = require("node-fetch");

// INDEX
module.exports.index = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listings/index.ejs", { alllisting });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/newlisting.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist.");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
  try {
    const { listing } = req.body;

    // Geocode using Nominatim (OpenStreetMap)
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(listing.location)}&format=json`
    );
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      req.flash("error", "Location not found.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      ...listing,
      geometry: {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
      },
      image: {
        url: req.file?.path || "", // fallback if no image uploaded
        filename: req.file?.filename || "",
      },
      owner: req.user._id,
    });

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/listings/new");
  }
};

// EDIT FORM
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image.url?.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const updatedData = { ...req.body.listing };

  // Update geometry if location changed
  if (req.body.listing.location && req.body.listing.location !== listing.location) {
    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.listing.location)}&format=json`
      );
      const geoData = await geoResponse.json();

      if (geoData.length > 0) {
        updatedData.geometry = {
          type: "Point",
          coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
        };
      }
    } catch (err) {
      console.warn("Geocoding failed:", err);
    }
  }

  Object.assign(listing, updatedData);

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted.");
  res.redirect("/listings");
};
