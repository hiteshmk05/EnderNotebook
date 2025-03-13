const Folder=require("../models/Folder");
const sendResponse=require('../utils/responseHandler');

exports.createFolder=async (req,res)=>{
    try {
        const userId=req.user._id;
        const email=req.user.email;
        const {folderName,parentFolderId}=req.body;

        if(!folderName){
            return sendResponse(res,400,false,"folder name not added");
        }

        const existingFolder=await Folder.findOne({
            email,
            folderName,
            parent:parentFolderId||null
        });

        if(existingFolder){
            return sendResponse(res,400,false,"folder with the name already exisits")
        }

        let level=1;

        if(parentFolderId){
            const parentFolder=await Folder.findById(parentFolderId);

            if(!parentFolder){
                return sendResponse(res,404,false,"parent folder not found get rekt");
            }

            level=parentFolder.level+1;

            if(level>4){
                return sendResponse(res,400,false,"maximum depth reached get rekt nub");

            }

        }

        const folderData={
            email,
            folderName,
            level,
            parent:parentFolderId || null,
            child:[],
            files:[]
        };

        const newFolder=await Folder.create(folderData);

        if(parentFolderId){
            await Folder.findByIdAndUpdate(
                parentFolderId,
                {$push:{child:newFolder._id}}
            );
        }

        return sendResponse(res,200,true,"folder created successfuuly heavy baat cheet");

    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"internal server error get rekt");
    }
};