const mongoose = require("mongoose");
const initdata= require("./data.js");
const Listing = require("../Models/listing.js");

//establishing database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const init_db = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "684d9ebdc09878c178deb6dd"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was intialised");
};
init_db();
