const mongoose=require("mongoose");

const folderSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    folderName:{
        type:String,
        required:true,
    },
    level:{
        type:Number,
        required:true,
        min:1,
        max:4,
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Folder',
        default:null,
    },
    child:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Folder',
    }],
    files:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'File',
    }],
    
});