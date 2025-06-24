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
    geometry: {
    type: {
      type: String, // Must be 'Point'
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
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
