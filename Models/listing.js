<<<<<<< HEAD
const  mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
//make schema of a new listing
const listingSchema = new Schema({
    title: {
        type:String,
        require: true
    },
    description: String,
    image: {
        filename: String,
        url: String,  

    },
    price:Number,
    location : String,
    country:String,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review",
        }
      ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
      
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await review.deleteMany({reviews:{$in:listing.reviews}});
    }
});

module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
=======
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Created a Schema of lisiting 
const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,

    image: {
        
        filename: String,
        url : String,
         // set default image in case user didn't provide image
        // set: (v) => v === " " ? "https://unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0" : v,

    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }]
});

//Creating Model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
>>>>>>> afd7339026c5a092661afefbd9274a1c52e253bf
