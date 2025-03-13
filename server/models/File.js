const mongoose=require("mongoose");

const fileSchema=mongoose.Schema({
    fileName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    folder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder",
        default:null,
    },
    fileType: {
        type: String,
        required: true,
        // only pdf would be allowed to uplaod as of now
    },
    source: {
        type: String,
        enum: ["cloudinary", "inline"],
        required: true,
    },
    
    cloudinaryId:{
        type:String,
    },
    cloudinaryUrl:{
        type:String,
    },
    content:{
        type:String,
    },

    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    size: {
        type: Number,
    },
});

module.exports = mongoose.model("File", fileSchema);