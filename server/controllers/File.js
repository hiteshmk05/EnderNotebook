const File=require("../models/File");
const Folder = require("../models/Folder");
const sendResponse=require("../utils/responseHandler");
const cloudinary = require('cloudinary').v2;

exports.uploadFile=async (req,res)=>{
    
};

exports.createNoteFile=async (req,res)=>{
    try {
        const userID=req.user.id;
        const {fileName,folderID,type,content}=req.body;

        if(!fileName || type!=='note'){
            return sendResponse(res,400,false,"file name and type not specified");
        }

        /* 
            checking if a file already exists with the specified name
            using indexing
        */
        if(folderID){
            const folder = await Folder.findOne({_id:folderID,user:userID});
            
            if(!folder){
                return sendResponse(res,400,false,"folder doesnt exist");
            }
        }

        const noteFilePayload={
            user:userID,
            fileName,
            folder:folderID || null,
            type,
            content:content || '',
        };

        try {
            const newNoteFile=await File.create(noteFilePayload);

            return sendResponse(res,201,true,"note file created",{file:newNoteFile});   
        } catch (error) {
            if(error.code===11000){
                return sendResponse(res,400,false,"file alreadt exists in this levle");
            }
            throw error;
        }

    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"bad request something idk get rekt");
    }
};