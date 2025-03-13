const File=require("../models/File");
const sendResponse=require("../utils/responseHandler");
const cloudinary = require('cloudinary').v2;

exports.upload=async (req,res)=>{
    try {
        const {fileName,folderId,fileBase64}=req.boyd;
        const email=req.user.email;

        if(!fileName || !fileBase64){
            return sendResponse(res,400,false,"missing fileds");
        }

        const existingFile = await File.findOne({
            fileName,
            email,
            folder: folderId || null,
            source: 'cloudinary'
        });

        if(existingFile) {
            return sendResponse(res, 400, false, "A file with this name already exists in this folder");
        }

        const cloudinaryResponse=await cloudinary.uploader.upload(
            fileBase64,{
                folder:'ender-notebook',
                resource_type:'raw',
                public_id:`${Date.now()}-${fileName}`,
                original_filename: fileName
            }
        );

        const newFile=await File.create({
            fileName,
            email,
            folder:folderId || null,
            fileType:'pdf',
            source:'cloudinary',
            cloudinaryId:cloudinaryResponse.public_id,
            cloudinaryUrl: cloudinaryResponse.secure_url,
            size: Math.round(fileBase64.length*0.75)
        });

        if(folderId){
            await Folder.findByIdAndUpdate(
                folderId,
                {$push:{files:newFile._id}}
            );
        }

        return sendResponse(res,200,true,"file uplaoded successfully");

    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"error uplaoding file get rekt");
    }
};

exports.createInlineFile=async (req,res)=>{
    try {
        const {fileName,folderId}=req.body;
        const email=req.user.email;

        if(!fileName){
            return sendResponse(res,400,false,"filename not given");
        }
        
        const existingFile = await File.findOne({
            fileName,
            email,
            folder: folderId || null,
            source: 'inline'
        });

        if(existingFile){
            return sendResponse(res,400,false,"same file exisits nub");
        }

        const newFile = await File.create({
            fileName,
            email,
            folder: folderId || null,
            fileType: 'note',
            source: 'inline',
            content:'',
            size: 0
        });

        if (folderId) {
            await Folder.findByIdAndUpdate(
                folderId,
                { $push: { files: newFile._id } }
            );
        }
        
        return sendResponse(res,200,true,"note created succcesfully");

    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"error creating the note get rekt");
    }
};