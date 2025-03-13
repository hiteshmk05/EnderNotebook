const mongoose=require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("database connected successfullly"))
    .catch((error)=>{
        console.log(error);
        console.log("database could be connected get rekt nub");
        process.exit(1);
    });
};