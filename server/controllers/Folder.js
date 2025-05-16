const Folder=require("../models/Folder");
const sendResponse=require('../utils/responseHandler');

/* 
    controller for creating a folder
    we take foldername from user 
    the level will be taken from the parent folder
    if theres no parent then it means its a root folder and we take level as 1
*/

exports.createFolder=async (req,res)=>{
    try {
        const userID=req.user.id;
        const {folderName,parentID}=req.body;

        if(!folderName) {
            return sendResponse(res,400,false,"folder name and level not specified")
        }
        
        let currLevel=1;

        if(parentID) {
            const parent = await Folder.findOne({ _id: parentID, user: userID });
            if (!parent) {
                return sendResponse(res, 404, false, "parent folder not found");
            }
            currLevel = parent.level + 1;
            if (currLevel > 4) {
                return sendResponse(res, 403, false, "maximum folder depth reached");
            }
        }

        const folderPayload = {
            user:userID,
            folderName:folderName,
            level:currLevel,
            parent:parentID || null,
        }

        try {
            const newFolder=await Folder.create(folderPayload);
            return sendResponse(res,200,true,"folder created successfully", {newFolder});

        } catch (error) {
            if(error.code===11000){
                return sendResponse(res,400,false,"folder cannot be created as a same name exists in this directory");
            }
            throw error;
        }
    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"internal server error get rekt");
    }
};